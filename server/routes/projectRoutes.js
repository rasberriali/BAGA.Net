const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const UserAuthModel = require("../models/UserAuth");
const PatientDetailsModel = require("../models/PatientDetails");
const DoctorsPatientDetails = require("../models/doctorsPatientDetails");


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

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserAuthModel.findOne({ email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          const response = { 
            message: "Success", 
            username: user.username, 
            role: user.role 
          };

          if (user.role === "doctor") {
            response.doctorId = user._id;
          }

          res.json(response);
        } else {
          res.status(401).json({ message: "The password is incorrect" });
        }
      } else {
        res.status(404).json({ message: "No record found" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});


router.post("/signup", (req, res) => {
  const { username, email, password, role } = req.body;

  UserAuthModel.create({ username, email, password, role })
    .then((user) => res.status(201).json(user))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.post("/addPatient", upload.array("xray", 5), (req, res) => {
  const { name, location, age, gender } = req.body;
  
  const xrayBase64 = req.files ? req.files.map(file => file.buffer.toString("base64")) : [];

  PatientDetailsModel.create({ name, location, age, gender, xray: xrayBase64 })
    .then((patient) => {
      console.log('Patient saved:', patient);
      res.status(201).json(patient);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get("/patients", (req, res) => {
  PatientDetailsModel.find()
    .then((patients) => res.status(200).json(patients))
    .catch((err) => res.status(500).json({ error: err.message }));
});


router.delete("/deletePatient/:id", (req, res) => {
  const { id } = req.params;
  console.log("Received patient ID:", id); 
  
  PatientDetailsModel.findByIdAndDelete(id)
    .then((patient) => {
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.status(200).json({ message: "Patient deleted successfully" });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.post('/assign-to-doctor', async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(patientId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: "Invalid patientId or doctorId format." });
    }

    const patient = await PatientDetailsModel.findById(patientId);
    if (!patient) return res.status(404).json({ error: "Patient not found." });

    const doctor = await UserAuthModel.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: "Doctor not found." });

    const existingEntry = await DoctorsPatientDetails.findOne({ patientId, doctorId });
    if (!existingEntry) {
      await DoctorsPatientDetails.create({
        patientId,
        doctorId,
        patientDetails: {
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          location: patient.location,
          xray: patient.xray || [],
        },
      });
    }

    res.status(200).json({ message: "Patient assigned successfully." });
  } catch (err) {
    console.error("Error during assignment:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/patients/assign-to-doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: "Invalid doctorId" });
    }

    const assignedPatients = await DoctorsPatientDetails.find({ doctorId })
      .populate("patientId"); 

    res.status(200).json(assignedPatients);
  } catch (error) {
    console.error("Error fetching assigned patients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/doctors-patients/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const patients = await DoctorsPatientDetails.find({ doctorId });
    
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await UserAuthModel.find({ role: "doctor" }).select("username _id");
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;