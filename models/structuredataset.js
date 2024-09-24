const mongoose = require('mongoose');

// images and segmentation labels
const StructureDataSetSchema = mongoose.Schema(
    {
        Name: {
            type: String,
            index: true,
            required:true, 
            //unique: true,
        },
        NameLower: {type: String, index: true},
        Description: String,
        OwnerName: String, 
        OwnerEmail: String, 
        // list of training set
        TrainSet: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Structure"
        }],
        ValidSet: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Structure"
        }],
        TestSet: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Structure"
        }],
        TrainFraction: Number,
        ValidFraction: Number,
        TestFraction: Number,
        SearchFilter: Object,
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('StructureDataSet', StructureDataSetSchema);