import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for navigation
import axios from 'axios';
import sideImage from "../images/sideImage.jpg"
import bagalogo from "../images/bagalogo.png"

function Signup() {
  const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
  const [username, setUserName] = useState(''); // Separate states for first name and last name
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('doctor'); // Default to 'doctor'
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUserName(value);
    } else if (name === 'lastName') {
      setLastName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else if (name === 'role') {
      setRole(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate password and confirm password
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Send data to backend
    axios
      .post(`${apiUrl}/patients/signup`, {
        username,
        lastName,
        email,
        password,
        role,
      })
      .then((result) => {
        console.log(result);
        navigate('/login');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex  justify-center items-center min-h-screen bg-gray-100">
      <div className='flex flex-row  justify-between mx-auto max-w-screen-lg'>

  
      <div className='flex flex-col w-full '>
     <div className="flex flex-col h-full">
  <div className="flex flex-col h-full shadow-2xl shadow-gray-400 rounded-l-lg">
    <img
      src={sideImage}
      alt="Side"
      className="w-full h-full object-cover rounded-l-lg shadow-2xl contrast-75"
    />
  </div>
</div>


      </div>
      <div className="flex flex-col w-1/2 bg-white p-8 rounded-r-lg shadow-xl max-w-sm shadow-gray-400">
      <div className='flex flex-row items-center justify-center mb-6 gap-2'>
        <img src={bagalogo} alt="" className='h-8 w-8'>
        </img>
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
      </div>
        
        <form onSubmit={handleSubmit}>
          {/* First Name and Last Name Fields */}
          <div className="flex flex-row gap-2">
            <div className="mb-4 w-1/2">
              <input
                type="text"
                name="username"
                placeholder="First Name"
                value={username}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="mb-4 w-1/2">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <select
              name="role"
              value={role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="doctor">Doctor</option>
              <option value="radtech">Radtech</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>

          {/* Login Link */}
          <div className="mt-4 text-sm text-slate-700 flex flex-row justify-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-700 ml-2 underline">
              Login!
            </Link>
          </div>
        </form>
      </div>
    </div>
     
    </div>
  );
}

export default Signup;
