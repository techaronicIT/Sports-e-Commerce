const mongoose = require("mongoose");
const subAdminSchema = new mongoose.Schema({
  
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    isLogout:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

module.exports = mongoose.model('accessor',subAdminSchema);