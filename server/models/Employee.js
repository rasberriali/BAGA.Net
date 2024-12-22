const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    username: {type:String, required:true},
    email: {type: String, required:true},
    password: {type:String,required:true},
    role: {type:String, enum:['doctor','radtech'],required:true}

})
const EmployeeModel = mongoose.model("employees", EmployeeSchema)
module.exports = EmployeeModel