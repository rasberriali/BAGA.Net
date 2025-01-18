import React from 'react'
import { useNavigate } from 'react-router-dom';
import xray from '../../images/xray.png';

const Topcontent = () => {
  const navigate = useNavigate();
  return (
    <div className='mt-2'>
    
       <section className="container mx-auto flex justify-between items-center py-10 px-6  mb-14">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-3/6 ">
          <img src={xray} alt="Xray" className=" object-contain rounded-lg shadow-sm" /> 
          </div>
          <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0 text-center md:text-left">
            <h1 className="xl:text-4xl md:text-3xl text-xl font-bold text-slate-600">
              Welcome to <span className=''>BAGA.NET</span>
            </h1>
            <h2 className="xl:text-5xl md:text-3xl text-2xl font-bold text-slate-900 mt-4 ">
              Revolutionizing Lung Disease Classification with FedML
            </h2>
            <p className="text-slate-700 mt-4">
              Streamline your workflow and enhance diagnostic accuracy with our cutting-edge federated machine
              learning platform, designed for doctors and radiologic technologists.
            </p>
            <div className="relative inline-flex mt-6">
  {/* Button */}
  <button
    className="relative border-2 border-blue-400 text-black  px-6 py-3 rounded-lg"
    onClick={() => navigate('/hero')}
  >
    Discover More
  </button>

  {/* Ping animation in the top-right corner */}
  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
    <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-sky-400 opacity-50"></span>
    <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 opacity-80"></span>
  </span>
</div>



            

            
            
          </div>
        </div>
      </section>
    </div>
  )
}

export default Topcontent
