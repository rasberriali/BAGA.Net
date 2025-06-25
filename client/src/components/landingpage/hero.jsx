import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bagalogo from "../../images/bagalogo.png";

const Hero = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); 
  const navigate = useNavigate();

  return (
    <nav className="xl:mt-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-8  shadow-lg rounded-sm">
        <div className="flex items-center">
          <img src={bagalogo} alt="Baga" className="xl:h-5 h-10 object-contain " />
          <span className="text-xl font-bold ml-2 hidden sm:block ">BAGA.NET</span>
        </div>

        <div className="space-x-4  lg:flex">
          <button
            className="text-gray-700 hover:text-blue-600"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>

     
    </nav>
  );
};

export default Hero;
