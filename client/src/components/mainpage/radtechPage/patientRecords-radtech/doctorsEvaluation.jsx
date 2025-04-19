import React, { useState } from 'react';

export default function DoctorsEvaluation({ evaluation, findings, xrayImages }) {
  const [classification, setClassification] = useState('');

  const handleDownloadAll = () => {
    if (!classification) {
      alert('Please select a classification first');
      return;
    }

    if (!xrayImages || xrayImages.length === 0) {
      alert('No X-ray images available to download');
      return;
    }

    try {
      xrayImages.forEach((image, index) => {
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${image}`;
        link.download = `${classification}_xray_image_${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } catch (error) {
      console.error('Error downloading images:', error);
      alert('Error downloading images. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex flex-row p-6 rounded-lg h-[30vh] bg-gray-100 gap-4">
        {/* Left Column - Findings */}
        <div className="w-1/2 flex flex-col">
          <div className='text-2xl font-bold text-black'>Impression:</div>
          <div className="w-full text-center text-red-600 flex flex-row mt-2">
            {evaluation ? evaluation : "Not yet evaluated by the doctor"}
          </div>
          <div className='text-2xl font-bold text-black mt-4'>Findings:</div>
          <div className="w-full text-center text-red-600 flex flex-row mt-2">
            {findings ? findings : "No findings recorded"}
          </div>
        </div>

        {/* Right Column - Classification and Images */}
        <div className="w-1/2 flex flex-col">
          {/* Classification Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Classification:</label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select Classification</option>
              <option value="normal">Normal</option>
              <option value="fibrosis">Fibrosis</option>
              <option value="edema">Edema</option>
              <option value="covid19">COVID-19</option>
            </select>
          </div>

          {/* X-ray Images */}
          {xrayImages && xrayImages.length > 0 && (
            <div className=''>
              <div className="text-sm font-medium text-gray-700 mb-2">X-ray Images:</div>
              <div className="flex flex-wrap gap-2">
                {xrayImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`data:image/jpeg;base64,${image}`}
                      alt={`X-ray ${index + 1}`}
                      className="w-14 h-14 object-cover rounded-md border-2 border-gray-300"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleDownloadAll}
                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
                disabled={!classification}
              >
                Download All Images as {classification ? classification.charAt(0).toUpperCase() + classification.slice(1) : '...'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
