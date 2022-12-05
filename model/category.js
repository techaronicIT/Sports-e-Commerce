const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const categorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        addedBy: {
            type: ObjectId,
            ref:'admin'
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },


    }, { timestamps: true });

module.exports = mongoose.model("category", categorySchema);