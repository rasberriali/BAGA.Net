import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorsNavbar from "./doctors-navbar";
import DoctorsSidebar from "./doctors-sidebar";

const DoctorsPatientActivity = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);

    const doctorId = localStorage.getItem("doctorId");
    if (!doctorId) {
      console.error("doctorId is missing!");
      setError("Doctor ID not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/patients/assign-to-doctor/${doctorId}`
      );
      console.log("API Response:", response);

      if (Array.isArray(response.data)) {
        setPatients(
          response.data.map((item) => ({
            id: item.patientId?._id || "Unknown ID",
            name: item.patientId?.name || "N/A",
            location: item.patientId?.location || "Unknown",
            age: item.patientId?.age || "Unknown",
            gender: item.patientId?.gender || "Unknown",
            xray: item.patientId?.xray?.length ? item.patientId.xray : [],
          }))
        );
      } else {
        console.error("Unexpected data format:", response.data);
        setError("Unexpected response format.");
      }
    } catch (error) {
      console.error("Error fetching assigned patients:", error);
      setError("Failed to load patient data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorsSidebar />
      <div className="flex flex-col flex-grow">
        <DoctorsNavbar />
        <div className="bg-white p-6 rounded-lg shadow-md mt-4 mx-6">
          <h3 className="text-4xl font-bold mb-6 text-gray-800">Assigned Patients</h3>

          {loading ? (
            <p className="text-center text-gray-500">Loading patients...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto mt-6 max-h-[60vh]">
              <table className="table-auto border-collapse w-full">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr className="bg-gray-200 text-left text-gray-700">
                    <th className="px-6 py-2">Patient Name</th>
                    <th className="px-6 py-2">Location</th>
                    <th className="px-6 py-2">Gender</th>
                    <th className="px-6 py-2">Age</th>
                    <th className="px-6 py-2">X-ray</th>
                    <th className="px-6 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <tr key={patient.id} className="">
                        <td className=" border-gray-300 px-4 py-2">{patient.name}</td>
                        <td className=" border-gray-300 px-4 py-2">{patient.location}</td>
                        <td className=" border-gray-300 px-4 py-2">{patient.gender}</td>
                        <td className=" border-gray-300 px-4 py-2">{patient.age}</td>
                        <td className="border-gray-300 px-4 py-2">
                        {patient.xray && patient.xray.length > 0 ? (
                          <img
                            src={patient.xray[0]} // Ensure this is a valid URL, not Base64
                            alt="X-ray"
                            className="w-40 h-40 object-cover rounded-md"
                            onError={(e) => (e.target.src = "/default-xray.png")}
                          />
                        ) : (
                          "No X-ray"
                        )}
                      </td>                      
                        <td className=" border-gray-300 px-4 py-2">
                          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No assigned patients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorsPatientActivity;
