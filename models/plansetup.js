const mongoose = require('mongoose');

const PlanSetupSchema = mongoose.Schema(
    {
        Id: {
            type: String,
            index: true,
            //        required:true, 
            //unique: true,
        },
        IdLower: {type: String, index: true},
        PlanType: String,
        ApprovalStatus: String,
        Comment: String,
        CreationDateTime: Date,
        CreationUserName: String,
        CreationDateTime: Date,
        CreationUserName: String,
        ApprovalStatus: Boolean,
        SeriesUID: String,
        "Series[dot]Id": String,
        TotalPrescribedDose: String,
        TreatmentApprovalDate: Date,
        TreatmentApprover: String,
        TreatmentOrientation: String,
        UID: String,
        NumberOfFractions: Number,
        PrescribedDosePerFraction: String,
        TreatmentOrientation: String,
        beam_list: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Beam"
        }],

        pt: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Patient"
        },
        sset: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "StructureSet"
        },
        img: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Image"
        },
        cs: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Course"
        },

    },
    {
        timestamps: false
    }
);

module.exports = mongoose.model('PlanSetup', PlanSetupSchema);