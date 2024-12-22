import React from 'react';
import { useNavigate } from 'react-router-dom';
import bagalogo from '../../images/bagalogo.png';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <nav className="mt-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-8 bg-white shadow-lg rounded-sm">
        <div className="flex items-center">
          <img src={bagalogo} alt="Baga" className="h-5 object-contain" />
          <span className="text-xl font-bold ml-2">BAGA.NET</span>
        </div>
        <div className="space-x-14">
          <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Models</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Contacts</a>
        </div>
        <div className="space-x-4">
          <button
            className="text-gray-700 hover:text-blue-600"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-blue-700"
           onClick={() => navigate('/signup')}
           >Sign Up</button>
        </div>
      </div>
    </nav>
  );
}

export default Hero;
