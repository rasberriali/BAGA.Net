const mongoose = require("mongoose");

const PatientDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  xray: { type: [String], required: false }, 
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
});


const PatientDetailsModel = mongoose.model("PatientDetails", PatientDetailsSchema);
module.exports = PatientDetailsModel;
