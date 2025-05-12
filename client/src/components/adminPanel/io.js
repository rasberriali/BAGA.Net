export const isBrowser = typeof window !== 'undefined';
export const API_CONFIG = { BASE_URL: 'http://localhost:5050', API_KEY: 'FeDMl2025' };

// Helper to get a clean JWT (or null)
export function getJwtToken() {
    const token = localStorage.getItem('jwtToken');
    return token && token !== 'null' ? token : null;
}


/**
 * Manually trigger purging of images marked as used
 * @param {Function} progressCallback - Optional callback for purge progress
 * @returns {Promise<Object>} - Results of the purge operation
 */
export async function manualPurgeUsedImages(progressCallback = () => {}) {
    try {
      progressCallback(0);
  
      // Get all images marked as used
      const usedImages = await getImagesByTrainingStatus('used');
      if (!usedImages || usedImages.length === 0) {
        progressCallback(1);
        return { 
          success: true, 
          message: "No used images found to purge", 
          purgedCount: 0 
        };
      }
  
      progressCallback(0.3);
      const imageIds = usedImages.map(img => img.id);
      const result = await purgeUsedImages();
      progressCallback(0.8);
  
      console.log(`Successfully purged ${result.purgedCount} used images`);
      progressCallback(1);
  
      return {
        success: true,
        message: `Successfully purged ${result.purgedCount} images`,
        purgedCount: result.purgedCount,
        purgedIds: imageIds
      };
    } catch (error) {
      console.error("Error during manual purge:", error);
      return {
        success: false,
        message: `Error purging images: ${error.message}`,
        error: error.toString()
      };
    }
  }


  export async function fetchTfjsModel(progressCallback = () => {}) {
    const tf = await import('@tensorflow/tfjs');
  
    const defaultParams = {
      epochs: 10,
      batch_size: 8,
      learning_rate: 0.001,
      min_local_samples: 2
    };
  
    let model = null;
    let modelType = null;
  
    // 1) Try the INT8 quantized model
    try {
      console.log('🔄 Attempting to load quantized INT8 model from IndexedDB…');
      model = await tf.loadLayersModel('indexeddb://tfjs_int8');
      console.log(model.globalWeights.length, model.globalWeights[0].shape);
      console.log('✅ Loaded INT8 model');
      modelType = 'int8';
    } catch (err) {
      console.warn('⚠️ Could not load INT8 model:', err);
    }
  
    // 2) If that failed, try the full-precision model
    if (!model) {
      try {
        console.log('🔄 Attempting to load full-precision model from IndexedDB…');
        model = await tf.loadLayersModel('indexeddb://tfjs_full');
        console.log(model.globalWeights.length, model.globalWeights[0].shape);
        console.log('✅ Loaded full-precision model');
        modelType = 'full';
      } catch (err) {
        console.warn('⚠️ Could not load full-precision model:', err);
      }
    }
  
    // 3) Finally, try the “default” key
    if (!model) {
      try {
        console.log('🔄 Attempting to load default model from IndexedDB…');
        model = await tf.loadLayersModel('indexeddb://tfjs_default');
        model.globalWeights = model.getWeights().map(w => w.clone());
        console.log(model.globalWeights.length, model.globalWeights[0].shape);
        console.log('✅ Loaded default model');
        modelType = 'default';
      } catch (err) {
        console.warn('⚠️ Could not load default model:', err);
      }
    }
  
    // 4) If any IndexedDB load succeeded, return immediately
    if (model) {
      return {
        model,
        trainingParams: defaultParams,
        modelType
      };
    }
  
    // 5) Otherwise fetch from server
    console.log('🔄 Fetching model from server…');
    const res = await fetch(`${API_CONFIG.BASE_URL}/tfjs/training_model`, {
      method: 'GET',
      headers: {
        'X-API-Key': API_CONFIG.API_KEY,
        'X-Client-ID': localStorage.getItem('clientId')
      }
    });
    if (!res.ok) {
      throw new Error(`❌ Failed to fetch TFJS model: ${res.status}`);
    }
    const data = await res.json();
  
    // 6) Load the fetched URL
    model = await tf.loadLayersModel(data.model_url);
    model.globalWeights = model.getWeights().map(w => w.clone());
    console.log(model.globalWeights.length, model.globalWeights[0].shape);

  
    // 7) Save it under your “default” key for next time
    await model.save('indexeddb://tfjs_default');
    console.log('✅ Fetched TFJS model saved to IndexedDB as "tfjs_default"');
  
    return {
      model,
      trainingParams: data.training_params || defaultParams,
      modelType: 'server'
    };
  }

/** 
 * Creates a typed array view into an ArrayBuffer 
 * @param {'float32'|'int32'|'bool'} dtype 
 * @param {ArrayBuffer} buffer 
 * @param {number} offsetElems  // offset in ELEMENTS, not bytes
 * @param {number} lengthElems  // number of elements
 */
function getTypedArrayForDType(dtype, buffer, offsetElems, lengthElems) {
    const byteOffset = offsetElems * bytesPerElement(dtype);
    switch (dtype) {
      case 'float32': return new Float32Array(buffer, byteOffset, lengthElems);
      case 'int32':   return new Int32Array(buffer, byteOffset, lengthElems);
      case 'bool':    return new Uint8Array(buffer, byteOffset, lengthElems);
      default: throw new Error(`Unsupported dtype ${dtype}`);
    }
}

export async function submitTrainedModel(trainedModel, systemMetrics = {}, progressCallback = () => {}) {
    if (!trainedModel || !trainedModel.model) {
      throw new Error("No trained model provided");
    }
  
    progressCallback(0); // Start
  
    // 1) extract artifacts
    progressCallback(10);
    const artifacts = await trainedModel.model.save(
      tf.io.withSaveHandler(x => Promise.resolve(x))
    );
  
    // 2) unpack into a plain object
    progressCallback(25);
    const { weightSpecs, weightData } = artifacts;
    const weightsJson = {};
    let offset = 0;
    for (const spec of weightSpecs) {
      const { name, shape, dtype } = spec;
      const size = shape.reduce((a, b) => a * b, 1);
      const arr = getTypedArrayForDType(dtype, weightData, offset, size);
      weightsJson[name] = Array.from(arr);
      offset += size;
    }
  
    // 3) build metadata payload
    progressCallback(35);
    const payload = {
      metrics: {
        accuracy:   parseFloat(trainedModel.accuracy  || 0),
        loss:       parseFloat(trainedModel.loss      || 0),
        precision:  parseFloat(trainedModel.precision || 0),
        recall:     parseFloat(trainedModel.recall    || 0),
        f1Score:    parseFloat(trainedModel.f1Score   || 0)
      },
      round:       trainedModel.round     || 0,
      num_samples: trainedModel.trainSize || 0,
      timestamp:   new Date().toISOString(),
      system_metrics: systemMetrics
    };
  
    // 4) assemble form
    progressCallback(50);
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    form.append('weights',  new Blob([JSON.stringify(weightsJson)], { type: 'application/json' }), 'weights.json');
  
    // 5) headers
    progressCallback(65);
    const API_KEY    = "FeDMl2025";
    const CLIENT_ID  = localStorage.getItem('clientId') || `client-${Date.now()}`;
    const JWT        = localStorage.getItem('jwtToken');
    const headers = {
      'X-API-Key': API_KEY,
      'X-Client-ID': CLIENT_ID
    };
    if (JWT) headers['Authorization'] = `Bearer ${JWT}`;
  
    // 6) network send
    progressCallback(80);
    const resp = await fetch("http://localhost:5050/tfjs/submit_weights", {
      method: 'POST',
      headers,
      body: form,
      credentials: 'include'
    });
  
    progressCallback(95);
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(`Submission failed: ${err.message || resp.statusText}`);
    }
  
    progressCallback(100);
    return resp.json();
  }
  