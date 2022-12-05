const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const venderSchema = new mongoose.Schema(
  {
    adminId: {
      type: ObjectId,
      ref: "accessor",
      trim: true,
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    storeId:{
      type:String,
      trim:true
    },

    // storeImage: {
    //       type: String,
    //       required: true,
    //       trim: true
    //   },
    // storeLogo:{
    //     type:String,
    //     required:true,
    //     trim:true
    // },

    users: [
      {
        _id: false,
        loginId: {
          type: String,
          trim: true,
        },
        password: {
          type: String,
          trim: true,
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    deletedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    address: {
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
      state: {
        type: String,
        required: true,
        trim: true,
      },
      pinCode: {
        type: Number,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
    },
    storeSize :{
      type: String,
      trim: true,
    },
    storeCapacity : {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("store", venderSchema);
