const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const EmployeeModel = require('./models/Employee')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/employee")

app.post('/login', (req,res) => {
    const {email,password} = req.body;

    EmployeeModel.findOne({email: email})
    .then(user => {
        if (user) {
            if (user.password === password) {
                res.json({message:"Success",role:user.role})
            }else{
                res.json("the password is incorrect")
            }
            }else{
                res.json("No record existed")
            }
        })
        .catch(err=> res.json(err))
})

app.post('/signup', (req,res) => {
    const {username, email, password, role} = req.body;
    EmployeeModel.create({username, email, password, role})
    .then(user =>res.json(user))
    .catch(err => res.json(err))

})

app.listen(3001, () => {
    console.log("bitch it is running")
})