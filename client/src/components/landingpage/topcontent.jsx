import React from 'react'
import { useNavigate } from 'react-router-dom';
import xray from '../../images/xray.png';

const Topcontent = () => {
  const navigate = useNavigate();
  return (
    <div className='mt-2'>
    
       <section className="container mx-auto flex justify-between items-center py-20 px-2 ">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-3/6 ">
          <img src={xray} alt="Xray" className=" object-contain rounded-lg shadow-sm" /> 
          </div>
          <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to BAGA.NET
            </h1>
            <h2 className="text-5xl font-bold text-gray-900 mt-4">
              Revolutionizing Lung Disease Classification with FedML
            </h2>
            <p className="text-gray-700 mt-4">
              Streamline your workflow and enhance diagnostic accuracy with our cutting-edge federated machine
              learning platform, designed for doctors and radiologic technologists.
            </p>
            <button className="mt-6 bg-teal-500 text-white px-6 py-3 rounded hover:bg-blue-700"
             onClick={() => navigate('/hero')}>
              Discover More
            </button>
            
          </div>
        </div>
      </section>
    </div>
  )
}

export default Topcontent
