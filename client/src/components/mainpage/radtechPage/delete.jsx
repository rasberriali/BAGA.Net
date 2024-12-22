import React, { useState } from 'react';
import del2 from '../../../images/del2.png';

function Delete() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
  const [isClicked, setIsClicked] = useState(false); // Manage image click state

  const openModal = () => {
    setIsModalOpen(true);
    setIsClicked(true); // Mark image as clicked
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsClicked(false); // Reset click state when modal is closed
  };

  const handleDelete = () => {
    // Handle delete logic here
    console.log("Item deleted");
    closeModal(); // Close modal after deletion
  };

  return (
    <div>
      {/* Trigger Image */}
      <div>
        <img
          src={del2}
          alt="Delete Icon"
          className={`w-12 h-12 cursor-pointer mt-2 rounded-full transition-all ${
            isClicked ? 'bg-[#00FF47] bg-opacity-30' : ''
          }`}
          onClick={openModal}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-center">
              Are you sure you want to delete this?
            </h2>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center mt-10">
              <button
                className="px-4 py-2 bg-gray-500 rounded-md hover:bg-gray-600"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Delete;
