import React, { useState } from 'react';
import add2 from '../../../images/add2.png';
import axios from 'axios';
import xrayy2 from '../../../images/xrayy2.jpg';

function Update() {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleUpload = () => {
    console.log('Selected Doctor:', selectedDoctor);
    console.log('Description:', description);
    setIsModalOpen(false);
    setIsClicked(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsClicked(false);
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
            setIsClicked(true);
          }}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-3/5">
            <h2 className="text-lg font-bold mb-4 text-start">Upload Patient</h2>
            <div className="flex flex-col h-full border-y-2 mb-4 border-[#4A5360]">
              <div className='flex flex-col px-4 py-2'>
                <div className='font-semibold text-base'> Assigned to:  <span className='font-thin text-sm'>Dr.Analyn Benitez</span></div>
                <div className='font-semibold text-base'> Radtech:  <span className='font-thin text-sm'>Dr.Analyn Benitez</span></div>
                <div className='font-semibold text-base'> Description: <span className='font-thin text-sm'>Dr.Analyn Benitez</span></div>
              </div>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <div className='flex flex-col bg-gray-700 w-1/3 justify-center items-center rounded-xl p-4'>
                  <div className=''>
                   <img 
                     src={xrayy2} 
                     alt="xrayy2" 
                     className="object-contain rounded-lg shadow-sm cursor-pointer w-full h-auto" 
                     onClick={() => setIsImageOpen(true)}
                   /> 
                   </div>
                </div>
              </div>
              <div className="mt-4 mb-4 flex flex-row justify-center">
              <textarea
                className="w-3/5 p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="Type description..."
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-between items-center">
              <button
                className="px-4 py-2 bg-gray-500 rounded-md hover:bg-gray-600"
                onClick={closeModal}
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

      {isImageOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="relative max-w-full max-h-full flex justify-center items-center">
            <button 
              className="absolute top-5 right-5 bg-gray-700 text-white px-3 py-2 rounded-full hover:bg-gray-600"
              onClick={() => setIsImageOpen(false)}
            >
              ✕
            </button>
            <img 
              src={xrayy2} 
              alt="xray_picture" 
              className="max-w-screen max-h-screen object-contain" 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Update;