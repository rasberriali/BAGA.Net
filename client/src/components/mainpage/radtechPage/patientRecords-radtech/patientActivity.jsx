import Sidebar from '../dashboard-radtech/sidebar';
import Navbar from '../dashboard-radtech/navbar';
import search from '../../../../images/search.png';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from 'react-icons/ai';
import { MdClear } from 'react-icons/md';
import Update from './update';
import Delete from './delete';
import View from './view';

const PatientActivity = () => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    age: '',
    gender: '',
  });
  const [files, setFiles] = useState([]);
  const [submittedImage, setSubmittedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get(`${apiUrl}/patients/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to fetch patients');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.age) errors.age = 'Age is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (files.length === 0) errors.files = 'At least one X-ray image is required';
    
    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        errors[`file${index}`] = 'Only image files are allowed';
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        errors[`file${index}`] = 'File size must be less than 5MB';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      files.forEach(file => {
        formDataToSend.append('xray', file);
      });

      console.log('Submitting form data:', {
        name: formData.name,
        location: formData.location,
        age: formData.age,
        gender: formData.gender,
        fileCount: files.length,
        fileTypes: files.map(f => f.type)
      });

      const response = await axios.post(`${apiUrl}/patients/addPatient`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Server response:', response.data);
      setSubmittedImage(response.data);
      setIsModalOpen(false);
      setFormData({ name: '', location: '', age: '', gender: '' });
      setFiles([]);
      fetchPatients();
    } catch (error) {
      console.error('Error uploading files:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add patient';
      setError(errorMessage);
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePatientDeletion = (patientId) => {
    setPatients(patients.filter(patient => patient._id !== patientId));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <div className="bg-white p-6 rounded-lg shadow-md mt-4 mx-6">
          <h3 className="text-4xl font-bold mb-6 text-gray-800">Patient</h3>

          <div className="flex flex-row justify-between mb-4">
            <div className="flex items-center -ml-2">
              <input
                type="text"
                placeholder="Search"
                aria-label="Search Bar"
                className="border rounded-md px-4 py-2 w-96 ml-2 border-gray-300 focus:outline-none focus:ring-1 bg-[#E3EBF3] focus:ring-blue-500"
              />
              <img src={search} alt="Search icon" className="w-5 h-5 -ml-8 cursor-pointer mt-2" />
            </div>
            <div className="flex flex-row ml-6">
              <div>
                <div
                  className="p-2 px-6 text-base text-white bg-lime-500 rounded-lg hover:bg-lime-600 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Patient
                </div>
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
                          className={`mt-1 p-2 w-full border rounded-lg bg-gray-700 border-none ${
                            validationErrors.name ? 'border-red-500' : ''
                          }`}
                        />
                        {validationErrors.name && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className={`mt-1 p-2 w-full border rounded-lg bg-gray-700 border-none ${
                            validationErrors.location ? 'border-red-500' : ''
                          }`}
                        />
                        {validationErrors.location && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className={`mt-1 p-2 w-full border rounded-lg bg-gray-700 border-none ${
                            validationErrors.age ? 'border-red-500' : ''
                          }`}
                        />
                        {validationErrors.age && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.age}</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className={`mt-1 p-2 w-full border rounded-lg bg-gray-700 text-white border-none ${
                            validationErrors.gender ? 'border-red-500' : ''
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {validationErrors.gender && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>
                        )}
                      </div>

                      <section className="py-2 w-full h-64">
                        {submittedImage ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={submittedImage}
                              alt="Submitted Preview"
                              className="w-full max-w-xs h-auto rounded-md mb-4"
                            />
                            <p className="text-green-600 font-bold">Image submitted successfully!</p>
                          </div>
                        ) : (
                          <div
                            className={`border-2 border-dashed rounded-lg py-4 text-center flex flex-col items-center justify-center ${
                              validationErrors.files ? 'border-red-500' : ''
                            }`}
                            onDrop={handleDrop}
                            onDragOver={(event) => event.preventDefault()}
                          >
                            <div className="flex flex-col items-center mb-4 text-gray-600">
                              <AiOutlineCloudUpload className="text-xl mb-2" />
                              <p className="text-xs font-bold">Drag and drop images here</p>
                            </div>
                            <input
                              type="file"
                              hidden
                              id="browse"
                              onChange={handleFileChange}
                              accept="image/*"
                              multiple
                            />
                            <label
                              htmlFor="browse"
                              className="text-xs bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-400 transition"
                            >
                              Browse files
                            </label>
                            {validationErrors.files && (
                              <p className="text-red-500 text-sm mt-2">{validationErrors.files}</p>
                            )}
                          </div>
                        )}

                        {files.length > 0 && (
                          <div className="w-full h-24 mt-4 overflow-y-auto border-t pt-4">
                            {files.map((file, index) => (
                              <div className="flex items-center justify-between p-2 border-b" key={index}>
                                <p className="text-xs font-medium">{file.name}</p>
                                <MdClear
                                  className="text-lg text-gray-500 hover:text-red-500 cursor-pointer"
                                  onClick={() => handleRemoveFile(index)}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {files.length > 0 && (
                          <div className="flex items-center text-green-600 mt-2">
                            <AiOutlineCheckCircle className="mr-1" />
                            <p className="text-xs font-bold">{files.length} image(s) selected</p>
                          </div>
                        )}
                      </section>

                      {files.length > 0 && (
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting}  
                          className={`mt-8 text-white text-xs px-4 py-2 rounded-md cursor-pointer transition ${isSubmitting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-400'}`}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                      )}

                      <div className="flex justify-end ">
                        <button
                          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-6 max-h-[60vh]">
            <table className="table-auto border-collapse w-full">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr className="bg-gray-200 text-left text-gray-700">
                  <th className="px-6 py-2 text-start">Patient Name</th>
                  <th className="px-6 py-2 text-start">Location</th>
                  <th className="px-6 py-2 text-start">Gender</th>
                  <th className="px-6 py-2 text-start">Age</th>
                  <th className="px-6 py-2 text-start">Xray</th>
                  <th className="px-6 py-2 text-start">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-6 py-2">{patient.name}</td>
                    <td className="px-6 py-2">{patient.location}</td>
                    <td className="px-6 py-2">{patient.gender}</td>
                    <td className="px-6 py-2">{patient.age}</td>
                    <td className="px-6 py-2"> {patient.xray && patient.xray.length > 0 ?
                    
                    (
                    <div className="flex flex-wrap space-x-2">
                      {patient.xray.map((xrayImage, index) => (
                        <img
                          key={index}
                          src={`data:image/jpeg;base64,${xrayImage}`} 
                          alt={`X-ray ${index}`}
                          className="2xl:w-40 2xl:h-40 lg:w-20 lg:h-20 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  ) : (
                    <p>No X-ray images available</p>
                  )}
                  </td>

                    <td className="px-6 py-2 flex space-x-2">
                      <Update patientId={patient._id} />
                        <Delete patientId={patient._id} onDelete={handlePatientDeletion} />
                        <View patient={patient} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500 text-white rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientActivity;
