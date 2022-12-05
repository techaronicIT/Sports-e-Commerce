const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const measurementUnitSchema = new mongoose.Schema(
    {
        // the measerment units are like kg, gm, ml, ltr, etc 
        weight: {
            type: String,
            enum:["kg","gm","ml","ltr",'nos','pcs','dozen','bunch','bundle','pack','bag','box','carton','jar','bottle','can','packet','roll','tube','spool','coil','drum','barrel','bale','sack','cartoon','pouch','tin','cylinder','cask','crate','tray','bowl','basket','bucket','bag','bottle','jar','can','box','carton','packet','roll','tube','spool','coil','drum','barrel','bale','sack','cartoon','pouch','tin','cylinder','cask','crate','tray','bowl','basket','bucket','ton'],
            trim: true,
        },
        dimension: {
            height: {
                type: Number,
            },
            width: {
                type: Number,
            },
            length: {
                type: Number,
            },
            tolowercase: true,
            
        },
        size: {
            type: String,
            enum: ['m', 'l', 's','x','xs', 'xx', 'xxl', 'xl', '3xl','4xl', 'meter', 'cm', 'mm', 'inch', 'feet'],
            trim: true,
            tolowercase: true,
        },



    }, { timestamps: true });


module.exports = mongoose.model("measurementUnit", measurementUnitSchema);