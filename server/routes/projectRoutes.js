const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const UserAuthModel = require("../models/UserAuth");
const PatientDetailsModel = require("../models/PatientDetails");
const DoctorsPatientDetails = require("../models/doctorsPatientDetails");


const router = express.Router();

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Allow file size up to 50MB
  fileFilter: (req, file, cb) => {
    // Accept image files only (JPG, JPEG, PNG, GIF)
    const allowedTypes = /jpg|jpeg|png|gif/;
    const fileType = allowedTypes.test(file.mimetype);
    
    if (fileType) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only image files are allowed!"), false); // Reject the file
    }
  },
});

// User authentication routes
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

          // Include doctorId if the user is a doctor
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

// router.get("/patients", (req, res) => {
//   PatientDetailsModel.find()
//     .then((patients) => res.status(200).json(patients))
//     .catch((err) => res.status(500).json({ error: err.message }));
// });
// // Update Patient
// router.put("/updatePatient/:id", (req, res) => {
//   const { id } = req.params;
//   const { name, location, age, gender, xray } = req.body;

//   PatientDetailsModel.findByIdAndUpdate(id, { name, location, age, gender, xray }, { new: true })
//     .then((patient) => res.status(200).json(patient))
//     .catch((err) => res.status(500).json({ error: err.message }));
// });

// Delete Patient
router.delete("/deletePatient/:id", (req, res) => {
  const { id } = req.params;
  console.log("Received patient ID:", id); // Log the received ID on the backend
  
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

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(patientId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: "Invalid patientId or doctorId format." });
    }

    // Find Patient
    const patient = await PatientDetailsModel.findById(patientId);
    if (!patient) return res.status(404).json({ error: "Patient not found." });

    // Find Doctor
    const doctor = await UserAuthModel.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: "Doctor not found." });

    // Check if patient is already assigned
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

    // Fetch patients assigned to this doctor
    const assignedPatients = await DoctorsPatientDetails.find({ doctorId })
      .populate("patientId"); // This ensures we get full patient details

    res.status(200).json(assignedPatients);
  } catch (error) {
    console.error("Error fetching assigned patients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});





// Get patients assigned to a specific doctor
// router.get("/doctor-patients/:doctorId", async (req, res) => {
//   try {
//     const { doctorId } = req.params;

//     const assignedPatients = await DoctorsPatientDetails.find({ doctorId }).populate("patientId");
//     res.status(200).json(assignedPatients);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get('/doctors-patients/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const patients = await DoctorsPatientDetails.find({ doctorId });
    
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get list of doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await UserAuthModel.find({ role: "doctor" }).select("username _id");
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;