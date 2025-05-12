import React, { useState, useEffect } from 'react';
import { InferenceSession, env, Tensor } from 'onnxruntime-web';
import axios from 'axios';
import { storeModel, getModel, storeExists, getDatabaseVersion } from '../../../utils/indexedDBUtils';
import * as ort from 'onnxruntime-web';

env.wasm.numThreads         = 1;
env.wasm.simd               = true;
env.wasm.proxy              = false;
env.wasm.enableWasmStreaming = false;


ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@latest/dist/'; 


const checkWasmSupport = async () => {
  if (!WebAssembly) {
    throw new Error("WebAssembly is not supported in this browser");
  }
  
  try {
    // Test if we can instantiate WebAssembly
    const module = await WebAssembly.compile(new Uint8Array([0,97,115,109,1,0,0,0]));
    return true;
  } catch (e) {
    console.error("WebAssembly compilation test failed:", e);
    return false;
  }
};
// Auth utilities
const getAuthToken = async (clientId = "web-client") => {
  const modelServerUrl = process.env.REACT_APP_MODEL_SERVER_URL || "http://localhost:5050";
  const apiKey = process.env.REACT_APP_MODEL_API_KEY || "FeDMl2025";
  
  try {
    const response = await axios.post(`${modelServerUrl}/api/token`, 
      { client_id: clientId },
      { 
        headers: { 
          'X-API-Key': apiKey,
          'X-Client-ID': clientId
        }
      }
    );
    
    // Store token in localStorage
    localStorage.setItem('fedml_token', response.data.access_token);
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting FedML auth token:', error);
    throw error;
  }
};

export default function BAGANETEvaluation({ patientId, xrayImages }) {
  const modelServerUrl = process.env.REACT_APP_MODEL_SERVER_URL || "http://localhost:5050";
  const backendApiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
  const apiKey = process.env.REACT_APP_MODEL_API_KEY || "FeDMl2025";

  const [model, setModel] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [predictedClass, setPredictedClass] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [inferenceMode, setInferenceMode] = useState('local');
  const [authToken, setAuthToken] = useState(null);
  const [modelEvaluation, setModelEvaluation] = useState(null);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [errorEvaluation, setErrorEvaluation] = useState(null);
  const [diagnosisOutput, setDiagnosisOutput] = useState('');
  // 3. FIX - Add WASM support state
  const [wasmSupported, setWasmSupported] = useState(true);

  const fetchModelEvaluation = async () => {
    if (!patientId) {
      // No need to fetch if we don't have a patient ID
      setModelEvaluation(null);
      return;
    }
    
    setLoadingEvaluation(true);
    setErrorEvaluation(null);
  
    try {
      const appToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Call the endpoint to get classification data
      const response = await axios.get(
        `${backendApiUrl}/patients/modelEvaluation/${patientId}`,
        {
          headers: { Authorization: `Bearer ${appToken}` }
        }
      );
  
      // Check for success and data
      if (response.data && response.data.success && response.data.evaluation) {
        setModelEvaluation(response.data.evaluation);
        
        // If there's classification data available, update the predictedClass state too
        if (response.data.evaluation.modelevaluation !== undefined) {
          setPredictedClass(response.data.evaluation.modelevaluation);
        }
      } else {
        // Handle the case where the request was successful but no data was found
        setModelEvaluation(null);
        if (response.data && response.data.message) {
          setErrorEvaluation(response.data.message);
        } else {
          setErrorEvaluation('No classification data available.');
        }
      }
    } catch (err) {
      console.error("Error fetching classification data:", err);
      setErrorEvaluation(`Failed to fetch classification data: ${err.message}`);
      setModelEvaluation(null);
    } finally {
      setLoadingEvaluation(false);
    }
  };

  useEffect(() => {
    // 4. FIX - First check WASM support before any other initialization
    const init = async () => {
      try {
        const isWasmSupported = await checkWasmSupport();
        setWasmSupported(isWasmSupported);
        
        if (!isWasmSupported) {
          setError("WebAssembly is not supported in this browser. The application cannot run locally.");
          // Force server inference mode if WASM not supported
          setInferenceMode('server');
          return;
        }
        
        // Rest of initialization
        const initAuth = async () => {
          try {
            // Check if we already have a token
            let token = localStorage.getItem('fedml_token');
            
            if (!token) {
              // Get a new token
              token = await getAuthToken();
            }
            
            setAuthToken(token);
          } catch (err) {
            console.error("Authentication failed:", err);
            setError("Authentication failed. Please try again later.");
          }
        };
    
        await initAuth();
        await fetchModelEvaluation();
        
        // Set initial image preview if images are available
        if (xrayImages && xrayImages.length > 0) {
          setImagePreview(`data:image/jpeg;base64,${xrayImages[selectedImage]}`);
        }
        
        // Check if OpenCV is loaded
        if (!window.cv) {
          console.error("OpenCV.js not loaded yet!");
          setError("OpenCV.js is not loaded. Please make sure it's properly included in your HTML.");
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError(`Initialization failed: ${err.message}`);
      }
    };
    
    init();
  }, [xrayImages, selectedImage, backendApiUrl]);

  const loadOrDownloadModel = async () => {
    try {
      // Check if 'models' store exists
      const hasModelsStore = await storeExists('models', 'xrayImagesDB');
      
      // If models store doesn't exist, we'll need to download the model
      if (!hasModelsStore) {
        console.log('🏗️ Models store does not exist, downloading model');
        
        // Fetch from server
        console.log('⬇️ Downloading model from server');
        const response = await fetch(`${modelServerUrl}/model`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/octet-stream',
            'X-API-Key': apiKey,
            'Authorization': `Bearer ${authToken}`,
          }
        });
        
        if (!response.ok) {
          throw new Error(`Model download failed: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
      
        // Save it in IndexedDB for next time
        await storeModel(arrayBuffer, 'default', 'xrayImagesDB');
      
        // Create session
        return InferenceSession.create(arrayBuffer, { executionProviders: ['wasm'] });
      }
      
      // Try to load from IndexedDB
      const modelBlob = await getModel('onnx_default', 'xrayImagesDB');      
      if (modelBlob) {
        console.log('🔁 Loading model from IndexedDB');
        const arrayBuf = await modelBlob.arrayBuffer();
        return InferenceSession.create(arrayBuf, { executionProviders: ['wasm'] });
      }
    
      // Fallback: fetch from server if model not in IndexedDB
      console.log('⬇️ Downloading model from server (fallback)');
      const response = await fetch(`${modelServerUrl}/model`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Accept': 'application/octet-stream',
          'X-API-Key': apiKey,
          'Authorization': `Bearer ${authToken}`,
        }
      });
      
      if (!response.ok) {
        throw new Error(`Model download failed: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
    
      // Save it in IndexedDB for next time
      await storeModel(arrayBuffer, 'default', 'xrayImagesDB');
    
      // Create session
      return InferenceSession.create(arrayBuffer, { executionProviders: ['wasm'] });
    } catch (error) {
      console.error("Error in loadOrDownloadModel:", error);
      throw error;
    }
  };
  
  const handleDownloadModel = async () => {
    setDownloading(true);
    try {
      if (!authToken) {
        const newToken = await getAuthToken();
        setAuthToken(newToken);
      }
      const session = await loadOrDownloadModel();
      setModel(session);
      console.log('✅ Model ready');
      return session;
    } catch (err) {
      console.error(err);
      setError('Failed to load model: ' + err.message);
      return null;
    } finally {
      setDownloading(false);
    }
  };

  const applyCLAHE = (srcMat) => {
    try {
      const labMat = new cv.Mat();
      cv.cvtColor(srcMat, labMat, cv.COLOR_RGB2Lab);
      let labChannels = new cv.MatVector();
      cv.split(labMat, labChannels);
      const clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
      clahe.apply(labChannels.get(0), labChannels.get(0));
      cv.merge(labChannels, labMat);
      cv.cvtColor(labMat, labMat, cv.COLOR_Lab2RGB);
      labChannels.delete();
      clahe.delete();
      console.log("✅ CLAHE applied successfully.");
      return labMat;
    } catch (e) {
      console.error("Error in CLAHE processing:", e);
      throw e;
    }
  };
  

  const preprocessImage = async (imageData) => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
  
        if (typeof imageData === 'string') {
          img.src = imageData.startsWith('data:')
            ? imageData
            : `data:image/jpeg;base64,${imageData}`;
        } else {
          reject("Invalid image data format");
          return;
        }
  
        img.onload = () => {
          try {
            // Create and prepare canvas
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
  
            // Preserve aspect ratio when drawing image
            const imgRatio = img.width / img.height;
            let drawW, drawH;
            if (imgRatio > 1) {
              drawW = 256;
              drawH = Math.round(256 / imgRatio);
            } else {
              drawH = 256;
              drawW = Math.round(256 * imgRatio);
            }
  
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, 256, 256); // pad with black
            ctx.drawImage(img, (256 - drawW) / 2, (256 - drawH) / 2, drawW, drawH);
  
            // 🔍 Optional: visualize canvas on page
            document.body.appendChild(canvas);
            canvas.style.border = "2px solid red";
            canvas.style.margin = "10px";
  
            if (!window.cv) {
              reject("OpenCV.js is not loaded");
              return;
            }
  
            let src = cv.imread(canvas);
            cv.cvtColor(src, src, cv.COLOR_BGR2RGB); // OpenCV loads as BGR
  
            // Center crop to 224x224
            const x = Math.floor((256 - 224) / 2);
            const y = Math.floor((256 - 224) / 2);
            let roi = src.roi(new cv.Rect(x, y, 224, 224));
  
            // 🔧 Optional CLAHE (currently disabled)
            // let processedImg = applyCLAHE(roi);
            let processedImg = roi;
  
            // Normalize using ImageNet mean and std
            const input = new Float32Array(1 * 3 * 224 * 224);
            let i = 0;
            for (let y = 0; y < 224; y++) {
              for (let x = 0; x < 224; x++) {
                for (let c = 0; c < 3; c++) {
                  let pixel = processedImg.ucharPtr(y, x)[c] / 255.0;
                  const mean = [0.485, 0.456, 0.406][c];
                  const std = [0.229, 0.224, 0.225][c];
                  input[i++] = (pixel - mean) / std;
                }
              }
            }
  
            // Clean up
            src.delete(); if (processedImg !== roi) processedImg.delete(); roi.delete();
  
            resolve({
              tensor: input,
              canvas: canvas.toDataURL('image/jpeg') // optional preview
            });
  
          } catch (e) {
            console.error("Error in image processing:", e);
            reject(e);
          }
        };
  
        img.onerror = (e) => {
          console.error("Image loading failed:", e);
          reject("Image loading failed: " + e.type);
        };
      } catch (err) {
        reject("Error setting up image preprocessing: " + err);
      }
    });
  };
  
  
  const runLocalInference = async (session, tensorData) => {
    // 1️⃣ grab ONNX input/output names
    const inputName  = session.inputNames[0];
    const outputName = session.outputNames[0];
    console.log("ONNX input node:",  inputName);
    console.log("ONNX output node:", outputName);
  
    // 2️⃣ build the tensor
    console.log("Creating tensor for local inference…");
    const tensor = new Tensor("float32", tensorData, [1, 3, 224, 224]);
  
    // 3️⃣ run the inference
    console.log("Running local inference…");
    const feeds = { [inputName]: tensor };
    console.log("tensorData[0..10]:", tensorData.slice(0,10));
    const results = await session.run(feeds);
  
    // 4️⃣ extract scores
    const outputTensor = results[outputName];
    const scores = Array.from(outputTensor.data);
    console.log("Raw model scores:", scores);
  
    // 5️⃣ softmax helper
    const softmax = (logits) => {
      const exps = logits.map(Math.exp);
      const sum = exps.reduce((a, b) => a + b, 0);
      return exps.map(e => e / sum);
    };
  
    const probs = softmax(scores);
    console.log("Softmax probabilities:", probs.map(p => p.toFixed(4)));
  
    // 6️⃣ argmax helper
    const argmax = (arr) => {
      let maxIdx = 0, maxVal = arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] > maxVal) {
          maxVal = arr[i];
          maxIdx = i;
        }
      }
      return maxIdx;
    };
  
    const maxIdx = argmax(scores);
    console.log(`→ Predicted class ${maxIdx} (p=${probs[maxIdx].toFixed(4)})`);
  
    return maxIdx;
  };
  
  const runServerInference = async (imageData) => {
    try {
      console.log("Preparing for server inference...");
      
      // Ensure we have a valid token
      if (!authToken) {
        const token = await getAuthToken();
        setAuthToken(token);
      }
      
      // Create a FormData object to send the image
      const formData = new FormData();
      
      // Convert base64 to blob
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();
      
      // Append the image to the form data
      formData.append('image', blob, 'image.jpg');
      
      console.log("Sending request to server for inference...");
      const response = await axios.post(`${modelServerUrl}/inference`, formData, {
        headers: {
          'X-API-Key': apiKey,
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Server inference response:", response.data);
      return response.data.predicted_class;
    } catch (err) {
      // Handle authentication errors
      if (err.response && err.response.status === 401) {
        try {
          console.log("Token expired, refreshing...");
          const newToken = await getAuthToken();
          setAuthToken(newToken);
          
          // Retry with new token
          const formData = new FormData();
          const base64Response = await fetch(imageData);
          const blob = await base64Response.blob();
          formData.append('image', blob, 'image.jpg');
          
          const response = await axios.post(`${modelServerUrl}/inference`, formData, {
            headers: {
              'X-API-Key': apiKey,
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          
          return response.data.predicted_class;
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          throw new Error(`Authentication failed: ${retryError.message}`);
        }
      }
      
      console.error("Server inference error:", err);
      throw new Error(`Server inference failed: ${err.message}`);
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setProcessing(true);
  
    try {
      // ─── validate image ───
      if (!xrayImages?.length) {
        setError("No X-ray images available for processing");
        return;
      }
      const imageToProcess = xrayImages[selectedImage];
      if (!imageToProcess) {
        setError("Selected image is not valid");
        return;
      }
  
      // ─── preprocess ───
      console.log("Processing image…");
      const { tensor: tensorData, canvas: processedImageDataUrl } =
        await preprocessImage(imageToProcess);
  
      let classResult;
      if (inferenceMode === 'server') {
        classResult = await runServerInference(processedImageDataUrl);
      } else {
        // ─── always load or download model ───
        const session = await loadOrDownloadModel();
        if (!session) {
          setError("Model loading failed. Please try again.");
          return;
        }
        setModel(session);              // cache it
        classResult = await runLocalInference(session, tensorData);
      }
  
      // ─── map to human label ───
      const idx = classResult;
      const description = getClassDescription(idx);
      console.log("Predicted class index:", idx);
      console.log("Diagnosis:", description);
  
      setDiagnosisOutput(`Class ID: ${idx}\nDiagnosis: ${description}`);
      setPredictedClass(idx);
  
      // ─── saving to backend ───
      const appToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      try {
        if (patientId) {
          console.log('Updating classification for patient:', patientId);
          // Save only class ID and diagnosis
          const response = await axios.put(
            `${backendApiUrl}/patients/modelEval/${patientId}`,
            {
              modelevaluation: idx,
              modelDiagnosisText: description
            },
            { headers: { Authorization: `Bearer ${appToken}` } }
          );
          console.log("✅ Patient classification updated", response.data);
          
          // Refresh evaluation data
          fetchModelEvaluation();
        } else {
          console.log('Creating new patient record');
          const response = await axios.post(
            `${backendApiUrl}/patients/saveResult`,
            {
              classifiedDisease: idx,
              evaluation: description,
              imageSrc: imageToProcess
            },
            { headers: { Authorization: `Bearer ${appToken}` } }
          );
          console.log("✅ New patient classification saved", response.data);
        }
      } catch (apiErr) {
        console.error("API error:", apiErr);
        setError(`Failed to save results to server: ${apiErr.message}`);
      }
    }
    catch (err) {
      console.error("Processing error:", err);
      setError(`Error during prediction: ${err.message}`);
    }
    finally {
      setProcessing(false);
    }
  };
  
  const handleImageSelect = (idx) => {
    setSelectedImage(idx);
    setImagePreview(`data:image/jpeg;base64,${xrayImages[idx]}`);
  };

  const toggleInferenceMode = () => {
    setInferenceMode(inferenceMode === 'local' ? 'server' : 'local');
  };

  // Determine class name based on the prediction
  const getClassDescription = (classId) => {
    const classNames = {
      0: "Edema",
      1: "Pneumothorax",
      2: "COVID-19",
      3: "Normal",
      4: "Pneumonia",
    };
    
    return classNames[classId] || `Unknown Class (${classId})`;
  };

  // FIXED: Updated renderEvaluationMetrics function to properly display class ID and diagnosis
  const renderEvaluationMetrics = () => {
    if (loadingEvaluation) {
      return (
        <div className="text-gray-500 text-sm italic">
          Loading classification data...
        </div>
      );
    }

    if (!modelEvaluation) {
      return (
        <div className="text-gray-500 text-sm italic">
          No classification data available
        </div>
      );
    }

    return (
      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium text-lg mb-2">Classification Result</h3>
        
        <div className="grid grid-cols-1 gap-y-2">
          {/* Always display Class ID as bolded text */}
          <div>
            <span className="font-bold">Class ID:</span> {modelEvaluation.modelevaluation}
          </div>
          
          {/* Always display Diagnosis as bolded text */}
          <div>
            <span className="font-bold">Diagnosis:</span> {modelEvaluation. modelDiagnosisText}
          </div>
        </div>
        
        {modelEvaluation.last_updated && (
          <div className="mt-2 text-xs text-gray-500">
            Last updated: {new Date(modelEvaluation.last_updated).toLocaleString()}
          </div>
        )}
      </div>
    );
  };


  return (
    <div>
      <div className='bg-white flex flex-col justify-between p-6 rounded-lg min-h-[40vh]'>
        <div className='flex flex-row gap-6'>
          {/* Image preview */}
          <div className='w-1/2 bg-gray-100 rounded-lg overflow-hidden'>
            {imagePreview ? (
              <img 
                src={imagePreview}
                alt="X-ray Preview" 
                className="w-full h-64 object-contain"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>

          {/* Results display */}
          <div className='w-1/2 flex flex-col text-black'>
            <div className='text-2xl font-bold mb-4'>
              Classification Results
            </div>
            
            <div className="mb-4 flex items-center">
              <span className="mr-2 text-sm">Inference Mode:</span>
              <button 
                onClick={toggleInferenceMode} 
                className={`px-3 py-1 text-xs rounded-md ${
                  inferenceMode === 'local' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-green-600 text-white'
                }`}
              >
                {inferenceMode === 'local' ? 'Local Inference' : 'Server Inference'}
              </button>
            </div>
            
            {predictedClass !== null ? (
              <div className='text-lg'>
                <div className="mb-2"><span className="font-semibold">Class ID:</span> {predictedClass}</div>
                <div><span className="font-semibold">Diagnosis:</span> {getClassDescription(predictedClass)}</div>
              </div>
            ) : (
              <div className='text-base text-gray-500'>
                Click "Generate" to classify this X-ray image
              </div>
            )}
            
            <div className='mt-auto'>
              <button
                onClick={handleGenerate}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
                disabled={downloading || processing}
              >
                {downloading ? 'Loading model...' : processing ? 'Processing...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Authentication status indicator */}
        <div className="mt-4 text-sm">
          <span className="mr-2">FedML Server:</span>
          <span className={`px-2 py-1 rounded-full text-xs ${authToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {authToken ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>
        
        {/* Model Evaluation Section - Now displays classification results */}
        {renderEvaluationMetrics()}
        
        {/* Thumbnails for multiple images */}
        {xrayImages && xrayImages.length > 1 && (
          <div className='mt-6'>
            <h3 className="text-black font-medium mb-2">Select X-ray Image:</h3>
            <div className='flex flex-row space-x-3 overflow-x-auto pb-2'>
              {xrayImages.map((img, idx) => (
                <div 
                  key={idx}
                  className={`relative cursor-pointer ${selectedImage === idx ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleImageSelect(idx)}
                >
                  <img
                    src={`data:image/jpeg;base64,${img}`}
                    alt={`X-ray ${idx+1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {idx+1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 font-medium rounded">
          {error}
        </div>
      )}
    </div>
  );
}