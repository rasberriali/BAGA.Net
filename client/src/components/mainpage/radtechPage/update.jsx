import React, { useState, useEffect, useCallback } from 'react';
import add2 from '../../../images/add2.png';
import axios from 'axios';

function Update() {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:3000/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        const filteredDoctors = data.filter(
          (doctor) => doctor && doctor.username && doctor.username.trim() !== ""
        );
  
        setDoctors(filteredDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
  
    fetchDoctors();
  }, []);
  

  const handleUpload = () => {
    if (!selectedDoctor) return; // Prevent submission if no doctor is selected
    console.log('Selected Doctor:', selectedDoctor);
    console.log('Description:', description);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsClicked(false);
    setSelectedDoctor('');
    setDescription('');
  };

  return (
    <div>
      <img
        src={add2}
        alt="add2"
        className={`w-12 h-12 cursor-pointer mt-2 rounded-full transition-all ${
          isClicked ? 'bg-[#00FF47] bg-opacity-30' : ''
        }`}
        onClick={() => {
          setIsModalOpen(true);
          setIsClicked(true);
        }}
      />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-center">Upload Patient</h2>

            {/* Error Message */}
            {error && <p className="text-red-400 text-center mb-2">{error}</p>}

            {/* Select Doctor Dropdown */}
            <select
                className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-500 mb-4"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                disabled={doctors.length === 0}
              >
                <option value="" disabled>
                  {doctors.length > 0 ? "Select Doctor" : "No doctors available"}
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor.username}>Dr. <span className='ml1'></span>
                    {doctor.username || doctor.name} 
                  </option>
                ))}
              </select>
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
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  selectedDoctor
                    ? 'bg-lime-500 text-white hover:bg-lime-600'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                onClick={handleUpload}
                disabled={!selectedDoctor}
              >
                + Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Update;
