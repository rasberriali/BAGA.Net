import React, { useState } from 'react';
import add2 from '../../../images/add2.png';
import axios from 'axios';

function Update() {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // Declare the state for click
  const [selectedPatient, setSelectedPatient] = useState(null); // For update
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // For update modal

  const handleUpload = () => {
    console.log('Selected Doctor:', selectedDoctor);
    console.log('Description:', description);
    setIsModalOpen(false); // Close the modal after uploading
    setIsClicked(false); // Reset isClicked when uploading
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setIsClicked(false); // Reset isClicked when modal is closed
  };

  const handleUpdateClick = (patient) => {
    setSelectedPatient(patient); // Set the patient details to be updated
    setIsUpdateModalOpen(true); // Open the update modal
  };

  const handleUpdateSubmit = async () => {
    try {
      const updatedPatient = { doctor: selectedDoctor, description }; // prepare patient data for update
      const response = await axios.put(`http://localhost:3000/patients/updatePatient/${selectedPatient._id}`, updatedPatient);
      console.log('Patient updated successfully:', response.data);
      // You can call fetchPatients() here if needed to refresh the list
      setIsUpdateModalOpen(false); // Close the update modal
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  return (
    <div>
      <div>
        <img
          src={add2}
          alt="add2"
          className={`w-12 h-12 cursor-pointer mt-2 rounded-full transition-all ${
            isClicked ? 'bg-[#00FF47] bg-opacity-30' : ''
          }`}
          onClick={() => {
            setIsModalOpen(true);
            setIsClicked(true); // Set the image as clicked
          }}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-center">Upload Patient</h2>

            {/* Select Doctor Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Doctor</label>
              <select
                className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="" disabled>Select Doctor</option>
                <option value="Dr. Yu Cruz">Dr. Yu Cruz</option>
                <option value="Dr. Analyn Benitez">Dr. Analyn Benitez</option>
              </select>
            </div>

            {/* Description Text Area */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="Type description..."
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button
                className="px-4 py-2 bg-gray-500 rounded-md hover:bg-gray-600"
                onClick={closeModal} // Close modal and reset clicked state
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600"
                onClick={handleUpload}
              >
                + Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-center">Update Patient</h2>

            {/* Select Doctor Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Doctor</label>
              <select
                className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="" disabled>Select Doctor</option>
                <option value="Dr. Yu Cruz">Dr. Yu Cruz</option>
                <option value="Dr. Analyn Benitez">Dr. Analyn Benitez</option>
              </select>
            </div>

            {/* Description Text Area */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="Type description..."
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button
                className="px-4 py-2 bg-gray-500 rounded-md hover:bg-gray-600"
                onClick={() => setIsUpdateModalOpen(false)} // Close modal and reset clicked state
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600"
                onClick={handleUpdateSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Update;
