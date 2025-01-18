import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';
import { LuLock } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);  // State for remember me checkbox
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // State for loading spinner
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post('http://localhost:3000/login', { email, password, rememberMe })  // Send rememberMe status
      .then((response) => {
        setIsLoading(false);  // Hide loader
        if (response.data.message === 'Success') {
          if (response.data.role === 'doctor') {
            navigate('/doctorsPage');
          } else if (response.data.role === 'radtech') {
            navigate('/radtechsPage');
          }
        } else {
          alert(response.data);  // Show error messages
        }
      })
      .catch((err) => {
        setIsLoading(false);  // Hide loader
        alert('Login failed. Please try again.');  // Error handling
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" relative p-8 rounded-lg shadow-lg max-w-sm w-full  bg-white">
      <div class="absolute top-0 opacity-30 rounded-t-lg left-0 w-full h-48 bg-gradient-to-b  from-blue-500 to-transparent"></div>
  
        <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                <AiOutlineMail />
              </span>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6 relative">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                <LuLock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-gray-700">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              'Login'
            )}
          </button>

          <div className="flex flex-col mt-4 justify-center items-center">
            <div className="flex flex-row mt-4 justify-center">
              <div>
                Don't have an account?{' '}
                <span className="text-blue-600 cursor-pointer">Sign Up</span>
              </div>
            </div>
            <div className="mt-4">or sign in with</div>

            {/* Social Login Buttons */}
            <div className="flex flex-row gap-2 mt-4">
              <div className="py-2 px-10 border border-slate-400 rounded-md cursor-pointer flex items-center gap-2">
                <FcGoogle />
                Google
              </div>
              <div className="py-2 px-10 border border-slate-400 rounded-md cursor-pointer flex items-center gap-2">
                <FaApple />
                Apple
              </div>
            </div>
          </div>
        </form>
      </div>
      
    </div>
  );
}

export default Login;
