const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: { 
        type: String, 
        // required:true,
        enum: ["Male", "Female", "Other"] 
    },
    dateOfBirth:{
      type:String,
      //type:Date,
      // required:true,
      trim:true
    },

    battingSide:{
        type:String,
        enum:["Right","Left"]
    },

    wishlist:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Product"
    }],

    // playerProfile:{
    //   type:String,
    //   enum:["Cricket","Football","Hockey","Tennis","Badminton","Volleyball", "Basketball","Gymnastics","Swimming","TableTennis","WeightLifting","Others"]
    // },

    email: {
      // valid
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true
      
    },

    phone: {
      // valid
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    password: {
      // minlen 8, maxlen 15 // encrypted password
      type: String,
      required: true,
      trim: true
     
    },

    mail_otp:{
      type:String,
      unique:true,
    },
    mobile_otp:{
      type:String
    },
    address: {
      shipping: {
        street: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        pincode: {
          type: Number,
          required: true,
          trim: true,
        },
      },
      billing: {
        street: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        pincode: {
          type: Number,
          required: true,
          trim: true,
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("e-User", userSchema);
