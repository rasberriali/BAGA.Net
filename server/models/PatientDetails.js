const mongoose = require("mongoose");

const PatientDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  xray: { type: [String], required: false }, // Array of base64 strings
});

// Model for the 'patientDetails' collection
const PatientDetailsModel = mongoose.model("patientDetails", PatientDetailsSchema);
module.exports = PatientDetailsModel;
