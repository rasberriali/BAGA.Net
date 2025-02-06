import React from 'react'
import Sidebar from '../../mainpage/radtechPage/sidebar';
import Navbar from '../../mainpage/radtechPage/navbar';

function contactManagement() {
  return (
    <div className="flex h-screen bg-gray-100">
    <Sidebar />
    <div className="flex flex-col flex-grow">
      <Navbar />
    </div>
    </div>
  )
}

export default contactManagement
