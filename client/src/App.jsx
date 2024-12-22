import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './auth/login';
import Signup from './auth/signup';
import Navbar from './components/landingpage/navbar';
import Hero from './components/landingpage/hero';
import Topcontent from './components/landingpage/topcontent';
import FeaturesList from './components/landingpage/features';
import PreTrainedModels from './components/landingpage/models';
import About from './components/landingpage/about';
import DoctorsPage from './components/mainpage/doctorPage/doctorsPage';
import RadtechsPage from './components/mainpage/radtechPage/radtechsPage';
import Dashboard from './components/mainpage/radtechPage/dashboard';
import PatientActivity from './components/mainpage/radtechPage/patientActivity';
import Doctorsdashboard from './components/mainpage/doctorPage/doctors-dashboard';
import DoctorsViewPatientActivity from './components/mainpage/doctorPage/doctorsView-patientActivity';




function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Topcontent />
      <About />
      <FeaturesList />
      <PreTrainedModels />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/doctorsPage" element={<DoctorsPage />} />
        <Route path="/radtechsPage" element={<RadtechsPage />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/doctors-dashboard" element={<Doctorsdashboard/>}/>
        <Route path="/doctorsView-patientActivity" element={<DoctorsViewPatientActivity/>}/>
        <Route path="/patientActivity" element={<PatientActivity/>}/>
        
        
      </Routes>
    </Router>
  );
}

export default App;
