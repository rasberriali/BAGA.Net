const mongoose = require('mongoose');

const UserAuthSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'radtech'], required: true }
});

const UserAuthModel = mongoose.model("userAuth", UserAuthSchema);
module.exports = UserAuthModel;
