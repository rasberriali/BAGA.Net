import * as tf from '@tensorflow/tfjs';
import { isBrowser } from './io.js';
// Ensure WebGL backend
tf.setBackend('webgl');
tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0);

// Module-level single WebGL context and canvas
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');
if (!gl) {
  throw new Error('WebGL not supported');
}

// Try to get lose_context extension
const loseExt = gl.getExtension('WEBGL_lose_context');

// Keep track of all GL resources we allocate
const GL = {
  buffers:   new Set(),
  textures:  new Set(),
  framebuffers: new Set(),
  shaders:   new Set(),
  programs:  new Set(),
};

// Helper wrappers that track resources
function createBuffer() {
  const b = gl.createBuffer();
  GL.buffers.add(b);
  return b;
}

function createTexture() {
  const t = gl.createTexture();
  GL.textures.add(t);
  return t;
}

function createFramebuffer() {
  const f = gl.createFramebuffer();
  GL.framebuffers.add(f);
  return f;
}

// -----------------------------
// Helpers: Compile shaders, create program
// -----------------------------
// Utility: compile a shader
function compileShader(src, type) {
  const s = gl.createShader(type);
  GL.shaders.add(s);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const err = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    GL.shaders.delete(s);
    throw new Error('Shader compile failed: ' + err);
  }
  return s;
}

// Utility: link program
function createProgram(vsSrc, fsSrc) {
  const vs = compileShader(vsSrc, gl.VERTEX_SHADER);
  const fs = compileShader(fsSrc, gl.FRAGMENT_SHADER);
  const p  = gl.createProgram();
  GL.programs.add(p);
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const err = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    GL.programs.delete(p);
    throw new Error('Program link failed: ' + err);
  }
  return p;
}

const quadVBO = createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1,-1,  1,-1,  -1,1,
   1,-1,  1,1,   -1,1,
]), gl.STATIC_DRAW);

function createTextureFromImage(gl, img) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
    gl.UNSIGNED_BYTE, img
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return tex;
}

function createEmptyTexture(gl, w, h) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D, 0,
    gl.RGBA, w, h, 0,
    gl.RGBA, gl.UNSIGNED_BYTE,
    null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return tex;
}

function createFBO(gl, texture) {
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D, texture, 0
  );
  const st = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (st !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error('Framebuffer not complete: ' + st);
  }
  return fbo;
}

// Full‐screen quad (once per call)
const quadVS = `
  attribute vec2 aPos;
  attribute vec2 aUV;
  varying vec2 vUV;
  void main() {
    vUV = aUV;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;
const quadVerts = new Float32Array([
  -1, -1,  0,0,
   1, -1,  1,0,
  -1,  1,  0,1,
  -1,  1,  0,1,
   1, -1,  1,0,
   1,  1,  1,1
]);

function setupQuad(gl, prog) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, 'aPos');
  const uv  = gl.getAttribLocation(prog, 'aUV');
  const stride = 4 * Float32Array.BYTES_PER_ELEMENT;
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(uv);
  gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, stride, 2*4);
}




  function createFramebuffer(gl, texture) {
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('Framebuffer not complete: ' + status);
    }
    return fbo;
  }

  function histogramFS(bins, tileX, tileY) {
    return `
      precision mediump float;
      varying vec2 vUV;
      uniform sampler2D uImage;
      uniform vec2 uImgSize;
      uniform vec2 uTileCount;
      const float numBins = float(${bins});
      
      void main() {
        vec2 pix = vUV * uImgSize;
        ivec2 tile = ivec2(floor(pix / (uImgSize / uTileCount)));
        
        // Calculate luminance from RGB (assuming RGB input)
        vec4 color = texture2D(uImage, vUV);
        float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114)); // Standard luminance conversion
        
        // Calculate which bin this pixel belongs to
        int bin = int(floor(lum * (numBins - 1.0)));
        
        // Calculate tile index (linear index of the tile)
        int tileIdx = tile.y * int(uTileCount.x) + tile.x;
        
        // Map the output pixel position to corresponding bin and tile
        // This logic is reversed: we're writing to the histogram texture here
        // by outputting a value that will accumulate in the right position
        ivec2 outputPos = ivec2(gl_FragCoord.xy); // Where we're writing in the output texture
        ivec2 targetPos = ivec2(bin, tileIdx); // Where we should write for this pixel's bin
        
        // Only contribute to the histogram if we're at the right position
        // Using float because we'll use additive blending to accumulate
        float count = 0.0;
        if (outputPos.x == targetPos.x && outputPos.y == targetPos.y) {
          count = 1.0;
        }
        
        gl_FragColor = vec4(count, 0.0, 0.0, 1.0);
      }
    `;
  }
  
  // Improved CDF shader with normalized accumulation
  function cdfFS(bins, tileX, tileY) {
    return `
      precision mediump float;
      varying vec2 vUV;
      uniform sampler2D uHist;
      uniform float uClip;
      const int BINS = ${bins};
      
      void main() {
        // Determine which bin and tile we're computing for
        int bin = int(floor(gl_FragCoord.x));
        int tileIdx = int(floor(gl_FragCoord.y));
        
        // Calculate CDF by accumulating all histogram values up to current bin
        float sum = 0.0;
        float totalSum = 0.0;
        
        // First pass: get total clipped sum for normalization
        for (int i = 0; i < ${bins}; i++) {
          vec2 texCoord = vec2((float(i) + 0.5) / float(${bins}), 
                               (float(tileIdx) + 0.5) / float(${tileX * tileY}));
          float binCount = texture2D(uHist, texCoord).r;
          totalSum += min(binCount, uClip);
        }
        
        // Second pass: accumulate up to current bin
        for (int i = 0; i < ${bins}; i++) {
          if (i > bin) break; // Early stop after reaching current bin
          
          vec2 texCoord = vec2((float(i) + 0.5) / float(${bins}), 
                               (float(tileIdx) + 0.5) / float(${tileX * tileY}));
          float binCount = texture2D(uHist, texCoord).r;
          sum += min(binCount, uClip);
        }
        
        // Normalize to [0,1] range
        float cdf = (totalSum > 0.0) ? sum / totalSum : 0.0;
        
        gl_FragColor = vec4(cdf, 0.0, 0.0, 1.0);
      }
    `;
  }
  
  // Apply shader with interpolation between tiles
  function applyFS(bins, tileX, tileY) {
    return `
      precision mediump float;
      varying vec2 vUV;
      uniform sampler2D uImage;
      uniform sampler2D uCdf;
      uniform vec2 uImgSize;
      uniform vec2 uTileCount;
      const float numBins = float(${bins});
      
      // Helper function to sample CDF for a specific tile and bin
      float sampleCDF(ivec2 tile, int bin) {
        // Convert float vec2 → int ivec2
        ivec2 tileCountI = ivec2(int(uTileCount.x), int(uTileCount.y));
        // Clamp tile coordinates to valid range
        tile = ivec2(
            int(clamp(float(tile.x), 0.0, float(tileCountI.x - 1))),
            int(clamp(float(tile.y), 0.0, float(tileCountI.y - 1)))
        );;
        
        // Calculate linear tile index
        int tileIdx = tile.y * int(uTileCount.x) + tile.x;
        
        // Sample CDF texture
        vec2 uv = vec2(
          (float(bin) + 0.5) / float(${bins}),
          (float(tileIdx) + 0.5) / float(${tileX * tileY})
        );
        
        return texture2D(uCdf, uv).r;
      }
      
      void main() {
        // Get pixel position and calculate which tile it belongs to
        vec2 pix = vUV * uImgSize;
        vec2 tileSize = uImgSize / uTileCount;
        vec2 tilePos = pix / tileSize;
        
        // Get integer tile coordinates and fractional part for interpolation
        ivec2 tile0 = ivec2(floor(tilePos));
        vec2 tileAlpha = fract(tilePos);
        
        // Get neighboring tiles for interpolation
        ivec2 tile1 = tile0 + ivec2(1, 0);
        ivec2 tile2 = tile0 + ivec2(0, 1);
        ivec2 tile3 = tile0 + ivec2(1, 1);
        
        // Get original pixel color/luminance
        vec4 color = texture2D(uImage, vUV);
        float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        
        // Calculate bin for this luminance
        int bin = int(floor(lum * (numBins - 1.0)));
        
        // Sample CDF values from surrounding tiles
        float cdf00 = sampleCDF(tile0, bin);
        float cdf10 = sampleCDF(tile1, bin);
        float cdf01 = sampleCDF(tile2, bin);
        float cdf11 = sampleCDF(tile3, bin);
        
        // Bilinear interpolation between tiles
        float cdfX0 = mix(cdf00, cdf10, tileAlpha.x);
        float cdfX1 = mix(cdf01, cdf11, tileAlpha.x);
        float finalCdf = mix(cdfX0, cdfX1, tileAlpha.y);
        
        // Scale color based on CDF (keeping the original color's hue)
        float scale = finalCdf / max(lum, 0.0001);
        vec3 adjustedColor = min(color.rgb * scale, vec3(1.0));
        
        gl_FragColor = vec4(adjustedColor, color.a);
      }
    `;
  }


  export async function gpuClaheFull(imageElement, opts = {}) {
    const { clipLimit=2, tileGridSize=[8,8], bins=64 } = opts;
  
    // 1) create fresh canvas + GL context
    const canvas = document.createElement('canvas');
    canvas.width  = imageElement.width;
    canvas.height = imageElement.height;
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (!gl) throw new Error('WebGL not supported');
  
    // 2) allocate textures + fbos
    const inputTex = createTextureFromImage(gl, imageElement);
    const histTex  = createEmptyTexture(gl, bins, tileGridSize[0]*tileGridSize[1]);
    const histFbo  = createFBO(gl, histTex);
    const cdfTex   = createEmptyTexture(gl, bins, tileGridSize[0]*tileGridSize[1]);
    const cdfFbo   = createFBO(gl, cdfTex);
  
    // 3) PASS 1: histogram
    const histProg = createProgram(gl, quadVS, histogramFS(bins, ...tileGridSize));
    gl.useProgram(histProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, histFbo);
    gl.viewport(0, 0, bins, tileGridSize[0]*tileGridSize[1]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    setupQuad(gl, histProg);
    gl.uniform2fv(gl.getUniformLocation(histProg,'uImgSize'), [canvas.width,canvas.height]);
    gl.uniform2fv(gl.getUniformLocation(histProg,'uTileCount'), tileGridSize);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, inputTex);
    gl.uniform1i(gl.getUniformLocation(histProg,'uImage'), 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  
    // 4) PASS 2: CDF
    const cdfProg = createProgram(gl, quadVS, cdfFS(bins, ...tileGridSize));
    gl.useProgram(cdfProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, cdfFbo);
    gl.viewport(0, 0, bins, tileGridSize[0]*tileGridSize[1]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.BLEND);
    setupQuad(gl, cdfProg);
    gl.uniform1f(gl.getUniformLocation(cdfProg,'uClip'), clipLimit);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, histTex);
    gl.uniform1i(gl.getUniformLocation(cdfProg,'uHist'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  
    // 5) PASS 3: apply
    const applyProg = createProgram(gl, quadVS, applyFS(bins, ...tileGridSize));
    gl.useProgram(applyProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    setupQuad(gl, applyProg);
    gl.uniform2fv(gl.getUniformLocation(applyProg,'uImgSize'), [canvas.width,canvas.height]);
    gl.uniform2fv(gl.getUniformLocation(applyProg,'uTileCount'), tileGridSize);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, inputTex);
    gl.uniform1i(gl.getUniformLocation(applyProg,'uImage'), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, cdfTex);
    gl.uniform1i(gl.getUniformLocation(applyProg,'uCdf'), 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  
    // 6) cleanup GL (but leave the canvas content intact)
    [inputTex, histTex, cdfTex].forEach(t => gl.deleteTexture(t));
    [histFbo, cdfFbo].forEach(f => gl.deleteFramebuffer(f));
    [histProg, cdfProg, applyProg].forEach(p => gl.deleteProgram(p));
  
    // 7) return this canvas + context so caller can tear it down later
    return { canvas, gl };
  }
// -----------------------------
// Existing load & processImageForTraining
// -----------------------------
export const loadImageToElement = async (imageRecord) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new Error('loadImageToElement: Requires a browser environment');
    }
  
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
  
      img.onload = () => {
        // If we created an object URL, revoke it to avoid memory leaks
        if (imageRecord.imageBlob && img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src);
        }
        resolve(img);
      };
  
      img.onerror = (err) => {
        reject(new Error('loadImageToElement: failed to load image'));
      };
  
      // Choose source
      if (imageRecord.objectURL) {
        img.src = imageRecord.objectURL;
      } else if (imageRecord.imageBlob) {
        img.src = URL.createObjectURL(imageRecord.imageBlob);
      } else if (typeof imageRecord.image === 'string') {
        img.src = imageRecord.image;
      } else {
        reject(new Error('loadImageToElement: no valid image source'));
      }
    });
  };



/**
 * Prepares image data for training by splitting into train/validation/test sets
 * @param {Array} images - Array of image objects from IndexedDB
 * @param {Function} progressCallback - Callback function for progress updates
 * @returns {Object} - Object containing training splits and metadata
 */
export const prepareData = async (images, progressCallback = () => {}) => {
  try {
    if (!isBrowser) {
      throw new Error("This function requires a browser environment");
    }

    if (!images || images.length === 0) {
      throw new Error("No images provided for preparation");
    }
    
    progressCallback(0.1);
    
    // Group images by classification
    const imagesByClass = {};
    let totalProcessed = 0;
    
    // Track image IDs for updating status after training
    const imageIds = [];
    
    // Modified: Check for either classifiedAs or classification field
    // Get classes first so they're available for all processing
    const classes = [...new Set(images.filter(img => 
      img.classifiedAs || img.classification
    ).map(img => 
      img.classifiedAs || img.classification
    ))];
    
    // Filter out "Unclassified" if it exists in the classes array
    const validClasses = classes.filter(cls => cls !== "Unclassified");
    
    if (validClasses.length === 0) {
      throw new Error("No valid classified images found for training");
    }
    
    console.log("Found classes for training:", validClasses);
    
    // Process each image
    for (const img of images) {
      // Modified: Check for either classifiedAs or classification field
      const classification = img.classifiedAs || img.classification;
      
      // Skip unclassified images or images with "Unclassified" classification
      if (!classification || classification === "Unclassified") {
        totalProcessed++;
        progressCallback((totalProcessed / images.length) * 0.3);
        continue;
      }
      
      // Track the image ID for later status update
      if (img.id) {
        imageIds.push(img.id);
      }
      
      // Initialize array for this class if needed
      if (!imagesByClass[classification]) {
        imagesByClass[classification] = [];
      }
      
      // Create image element to load image data
      const imgElement = await loadImageToElement(img);
      if (!imgElement) {
        totalProcessed++;
        progressCallback((totalProcessed / images.length) * 0.3);
        continue; // Skip images that can't be loaded
      }
      
      // Process the image for training (resize, normalize, etc.)
      const processedImage = await processImageForTraining(imgElement, classification, validClasses);
      
      if (processedImage) {
        imagesByClass[classification].push(processedImage);
      }
      
      totalProcessed++;
      progressCallback((totalProcessed / images.length) * 0.3);
    }
    
    progressCallback(0.4);
    
    // Check if we have valid data to proceed
    if (Object.keys(imagesByClass).length === 0) {
      throw new Error("No valid classified images found for training");
    }
    
    // Split data into train/validation/test
    const train = [];
    const validation = [];
    const test = [];
    
    // Use a 70/15/15 split
    for (const className in imagesByClass) {
      const classImages = imagesByClass[className];
      
      if (classImages.length === 0) continue;
      
      // Shuffle the images
      tf.util.shuffle(classImages);
      
      const trainCount = Math.max(1, Math.floor(classImages.length * 0.7));
      const valCount = Math.max(1, Math.floor(classImages.length * 0.15));
      
      // Split the images
      train.push(...classImages.slice(0, trainCount));
      validation.push(...classImages.slice(trainCount, trainCount + valCount));
      test.push(...classImages.slice(trainCount + valCount));
    }
    
    progressCallback(0.5);
    
    // Shuffle the datasets
    tf.util.shuffle(train);
    tf.util.shuffle(validation);
    tf.util.shuffle(test);
    
    // Return the prepared data with image IDs for status tracking
    console.log("Prepared dataset summary:", {
      train: train.length,
      val: validation.length,
      test: test.length,
      imageIds: imageIds.length,
      classes: validClasses
    });
    
    return {
      train,
      validation,
      test,
      classes: validClasses,
      totalCount: train.length + validation.length + test.length,
      distribution: Object.fromEntries(
        Object.entries(imagesByClass).map(([k, v]) => [k, v.length])
      ),
      imageIds // Include image IDs for later status updates
    };
  } catch (error) {
    console.error("Error preparing data:", error);
    throw new Error("Failed to prepare training data: " + error.message);
  }
};

export async function processImageForTraining(imgEl, cls, classes) {
  // 1) Do the heavy lifting in a tidy
  const { data, shape } = tf.tidy(() => {
    const t = tf.browser.fromPixels(imgEl).toFloat().div(255);
    const r = tf.image.resizeBilinear(t, [224,224]);
    const mean = tf.tensor1d([0.485,0.456,0.406]);
    const std  = tf.tensor1d([0.229,0.224,0.225]);
    const norm= r.sub(mean).div(std);
    // Grab raw bytes back on CPU:
    const cpuData = norm.dataSync();
    // Return only the CPU array; norm, mean, std, r, t get disposed:
    return { data: new Float32Array(cpuData), shape: [224,224,3] };
  });

  // 2) No leftover tensors on GPU at this point!
  // 3) Clean up WebGL context if you created a custom one:
  if (gl) {
    const ext = gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
  }

  return {
    data,
    shape,
    class: cls,
    label: classes.indexOf(cls),
  };
}
