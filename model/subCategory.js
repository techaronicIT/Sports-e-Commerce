const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const subCategorySchema = new mongoose.Schema({
    subCategoryName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    category: {
        type: ObjectId,
        ref: "category",
    },
    addedBy: {
        type: ObjectId,
        ref: "admin",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    
    }
}, { timestamps: true });
//  mongoose.models.Customer || mongoose.model('Customer', customerSchema);

module.exports = mongoose.models.subCategory || mongoose.model("subCategory", subCategorySchema);