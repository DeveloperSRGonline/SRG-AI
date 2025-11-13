// require here
const mongoose = require('mongoose')

// user schema creation
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            required:true,
        }
    },
    password:{
        type:String
    }
},{
    timestamps:true
})

// userModel creation
const userModel = mongoose.model("user",userSchema)


// exporting userModel to user further
module.exports = userModel;