import React, { useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { MdClear } from "react-icons/md";

const DragNdrop = ({
  onFilesSelected,
  onSubmit, // Callback function to handle submit action
  width = 'w-full', // Default to full width if not specified
  height = 'h-64', // Default height if not specified
}) => {
  const [files, setFiles] = useState([]);
  const [submittedImage, setSubmittedImage] = useState(null);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (onSubmit && files.length > 0) {
      onSubmit(files);
      // Set the first image as the submitted image and clear the files list
      setSubmittedImage(URL.createObjectURL(files[0]));
      setFiles([]);
    }
  };

  useEffect(() => {
    onFilesSelected(files);
  }, [files, onFilesSelected]);

  return (
    <section className={`bg-white border border-gray-300 rounded-lg p-2 ${width} ${height}`}>
      {submittedImage ? (
        // Display the first image after submission
        <div className="flex flex-col items-center">
          <img
            src={submittedImage}
            alt="Submitted Preview"
            className="w-full max-w-xs h-auto rounded-md mb-4"
          />
          <p className="text-green-600 font-bold">Image submitted successfully!</p>
        </div>
      ) : (
        // Drag and Drop Area
        <div
          className={`border-2 rounded-lg py-4 text-center flex flex-col items-center justify-center ${
            files.length > 0 ? "border-green-500" : "border-blue-500"
          }`}
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
        >
          <>
            <div className="flex flex-col items-center mb-4 text-gray-600">
              <AiOutlineCloudUpload className="text-xl mb-2" />
              <p className="text-xs font-bold">Drag and drop images here</p>
            </div>
            <input
              type="file"
              hidden
              id="browse"
              onChange={handleFileChange}
              accept="image/*"
              multiple
            />
            <label
              htmlFor="browse"
              className="text-xs  bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-400 transition"
            >
              Browse files
            </label>
          </>

          {files.length > 0 && (
            <div className="w-full h-32 mt-4 overflow-y-auto border-t pt-4">
              {files.map((file, index) => (
                <div
                  className="flex items-center justify-between p-2 border-b"
                  key={index}
                >
                  <p className="text-xs font-medium">{file.name}</p>
                  <MdClear
                    className="text-lg text-gray-500 hover:text-red-500 cursor-pointer"
                    onClick={() => handleRemoveFile(index)}
                  />
                </div>
              ))}
            </div>
          )}

          {files.length > 0 && (
            <div className="flex items-center text-green-600 mt-4">
              <AiOutlineCheckCircle className="mr-1" />
              <p className="text-xs font-bold">{files.length} image(s) selected</p>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      {files.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-500 text-white text-xs px-4 py-2 rounded-md cursor-pointer hover:bg-green-400 transition"
        >
          Submit
        </button>
      )}
    </section>
  );
};

export default DragNdrop;
