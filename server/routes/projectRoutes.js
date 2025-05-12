const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const UserAuthModel = require("../models/UserAuth");
const PatientDetailsModel = require("../models/PatientDetails");
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|gif/;
    const fileType = allowedTypes.test(file.mimetype);
    if (fileType) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserAuthModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No record found" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "The password is incorrect" });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = { 
      message: "Success", 
      token,
      username: user.username, 
      role: user.role,
      _id: user._id
    };

    if (user.role === "doctor") {
      response.doctorId = user._id;
    }

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, lastName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await UserAuthModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const user = new UserAuthModel({
      username,
      lastName,
      email,
      password,
      role
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      username: user.username,
      role: user.role,
      _id: user._id
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Uploading route
router.post("/addPatient", auth, upload.array("xray", 5), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('User:', req.user);

    const { name, location, age, gender } = req.body;
    
   // Convert files to base64
    const xrayBase64 = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const base64 = file.buffer.toString('base64');
        xrayBase64.push(base64);
      }
    }


    // Validate required fields
    if (!name || !location || !age || !gender) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Create patient
    const patient = new PatientDetailsModel({
      name,
      location,
      age: parseInt(age),
      gender,
      xray: xrayBase64,
      createdBy: req.user.id
    });

    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/patients", auth, async (req, res) => {
  try {
    const patients = await PatientDetailsModel.find({ createdBy: req.user.id });
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/deletePatient/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid patient ID format" });
    }

    const patient = await PatientDetailsModel.findById(id);
    
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Check if user has permission to delete
    if (patient.createdBy.toString() !== req.user.id && req.user.role !== 'doctor') {
      return res.status(403).json({ error: "Not authorized to delete this patient" });
    }

    const deletedPatient = await PatientDetailsModel.findByIdAndDelete(id);
    if (!deletedPatient) {
      return res.status(404).json({ error: "Patient not found or already deleted" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error in deletePatient route:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// NEW ASSIGNMENT ROUTE: Update the PatientDetails record with doctorId
router.post('/assign-to-doctor', async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(patientId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: "Invalid patientId or doctorId format." });
    }
    const patient = await PatientDetailsModel.findById(patientId);
    if (!patient) return res.status(404).json({ error: "Patient not found." });

    // Update patient record by assigning the doctor
    patient.doctorId = doctorId;
    await patient.save();

    res.status(200).json({ message: "Patient assigned successfully." });
  } catch (err) {
    console.error("Error during assignment:", err);
    res.status(500).json({ error: err.message });
  }
});

// NEW FETCH ASSIGNED PATIENTS: Query PatientDetails by doctorId
router.get("/patients/assign-to-doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: "Invalid doctorId" });
    }
    const assignedPatients = await PatientDetailsModel.find({ doctorId });
    res.status(200).json(assignedPatients);
  } catch (error) {
    console.error("Error fetching assigned patients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// NEW Update Evaluation route: Update evaluation in PatientDetails
router.put('/updateEvaluation/:id', async (req, res) => {
  try {
    const { evaluation, findings } = req.body;
    const updatedPatient = await PatientDetailsModel.findByIdAndUpdate(
      req.params.id,
      { evaluation, findings },
      { new: true }
    );
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Evaluation updated successfully', patient: updatedPatient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected dashboard routes
router.get("/dashboard-counts", auth, async (req, res) => {
  try {
    const totalDoctors = await UserAuthModel.countDocuments({ role: "doctor" });
    const totalRadtechs = await UserAuthModel.countDocuments({ role: "radtech" });
    const totalPatients = await PatientDetailsModel.countDocuments();

    res.json({ totalDoctors, totalRadtechs, totalPatients });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get("/doctors", auth, async (req, res) => {
//   try {
//     const doctors = await UserAuthModel.find({ role: "doctor" })
//       .select("username _id")
//       .lean();
//     res.status(200).json(doctors);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Get a single patient by ID
router.get("/patients/:id", auth, async (req, res) => {
  try {
    const patient = await PatientDetailsModel.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Error fetching patient data" });
  }
});

// Add new route for downloading files
router.get("/download/:patientId/:classification", auth, async (req, res) => {
  try {
    const { patientId, classification } = req.params;
    
    // Create classification directory if it doesn't exist
    const downloadDir = path.join(__dirname, '../downloads', classification);
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    // Get patient data
    const patient = await PatientDetailsModel.findById(patientId);
    if (!patient || !patient.xray || patient.xray.length === 0) {
      return res.status(404).json({ message: "No X-ray images found" });
    }

    // Save images to the classification directory
    const savedFiles = [];
    for (let i = 0; i < patient.xray.length; i++) {
      const imageBuffer = Buffer.from(patient.xray[i], 'base64');
      const fileName = `xray_image_${i + 1}.jpg`;
      const filePath = path.join(downloadDir, fileName);
      
      fs.writeFileSync(filePath, imageBuffer);
      savedFiles.push(filePath);
    }

    res.json({ 
      message: "Files saved successfully",
      files: savedFiles,
      downloadPath: downloadDir
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Error saving files" });
  }
});

module.exports = router;
