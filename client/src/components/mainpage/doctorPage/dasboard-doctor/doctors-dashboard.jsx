import React from 'react';
import Navbar from './doctors-navbar';
import Sidebar from './doctors-sidebar';
import Charts from './charts';
import dashPatient from '../../../../images/dashPatient.png'
import doctors from '../../../../images/doctors.png';
import num from '../../../../images/num.png';
import redArrow from '../../../../images/redArrow.png';
import greenArrow from '../../../../images/greenArrow.png';

function Doctorsdashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
    
    <Sidebar />
    <div className="flex flex-col flex-grow">
      <Navbar />
      <div className="p-6 flex flex-col">
          <div className='text-4xl font-bold'>Dashboard </div>
          <div className='mt-2'>A quick data overview of the clinic.</div>
          </div> 
          <div className="p-6 -mt-2 flex flex-col space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow-md">
             <img src = {doctors} alt=""></img>
              <h3 className="text-lg font-semibold mt-2 mb-2">Total Doctors</h3>
              <div className='flex flex-row justify-between items-center'>
              <img src = {num} alt="" className='h-4 contain-content'></img>
              <div className='flex flex-row gap-4 '>
                <div className='flex flex-row items-center'>
              <img src = {greenArrow} alt="" className='h-6 contain-content'></img>
              <div>95%</div></div>
              <div className='flex flex-row items-center'> 
              <img src = {redArrow} alt="" className='h-6 contain-content'></img>
              <div>5%</div></div>
              </div>
              
            </div> </div>
            <div className="bg-white p-4 rounded shadow-md">
             <img src = {dashPatient} alt=""></img>
              <h3 className="text-lg font-semibold mt-2 mb-2">Current Total Patients</h3>
              <div className='flex flex-row justify-between items-center'>
              <img src = {num} alt="" className='h-4 contain-content'></img>
              <div className='flex flex-row gap-4 '>
                <div className='flex flex-row items-center'>
              <img src = {greenArrow} alt="" className='h-6 contain-content'></img>
              <div>85%</div></div>
              <div className='flex flex-row items-center'> 
              <img src = {redArrow} alt="" className='h-6 contain-content'></img>
              <div>15%</div></div> </div>
            </div> </div>
            <div className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold">Reports</h3>
              <p className="text-4xl font-bold">30</p>
            </div>
          </div>

          <Charts />
       
</div>
      
        </div>
    </div>
  )
}

export default Doctorsdashboard
