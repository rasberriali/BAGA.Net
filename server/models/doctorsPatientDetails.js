const mongoose = require("mongoose");

const DoctorsPatientDetailsSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true }, // Reference to doctor
  name: { type: String, required: true },
  location: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  xray: { type: [String], required: false }, // Array of base64 strings
});

const DoctorsPatientDetailsModel = mongoose.model("doctorspatientDetails", DoctorsPatientDetailsSchema);
module.exports = DoctorsPatientDetailsModel;
