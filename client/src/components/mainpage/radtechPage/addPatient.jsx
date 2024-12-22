import React, { useState } from 'react';

const AddPatient = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    age: '',
    gender: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // Add your form submission logic here
    setIsModalOpen(false); // Close the modal after submission
  };

  return (
    <div>
      {/* Add Patient Button */}
      <div
        className="p-2 px-6 text-base  text-white bg-lime-500 rounded-lg hover:bg-lime-600 cursor-pointer border-none"
        onClick={() => setIsModalOpen(true)}
      >
        Add Patient
      </div>

      {/* Modal/Card */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-white">Add Patient Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Patient Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-lg bg-gray-700 border-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-lg bg-gray-700 border-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-lg border-none bg-gray-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-lg bg-gray-700 text-white border-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPatient;
