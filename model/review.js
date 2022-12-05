const mongoose=require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const reviewSchema = new mongoose.Schema({
    productId :{
        required: true,
        type : ObjectId,
        ref : "product"  
    },
    reviewedBy:{
        type : String,
        required: true,
        default: "guest", 
    },

    rating:{
        type:String,
        required: true
    },
    review:{
        type: String,
    },
    isDeleted: {
        type : Boolean,
        default: false
    },
    deletedAt: {  
        type: Date,
        default:null
    },
}, {timestamps:true})
module.exports = mongoose.model('reviewProduct', reviewSchema)