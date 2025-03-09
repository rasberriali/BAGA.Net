const mongoose = require("mongoose");

const DoctorsPatientDetailsSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "PatientDetails", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "UserAuth", required: true },
  patientDetails: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    location: { type: String, required: true },
    xray: { type: [String], required: false },
    
  }
});

module.exports = mongoose.model("DoctorsPatientDetails", DoctorsPatientDetailsSchema);

