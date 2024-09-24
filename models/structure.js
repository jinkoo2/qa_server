
const mongoose = require('mongoose');

const StructureSchema = mongoose.Schema(
    {
        Name: { type: String, index: true },
        NameLower: { type: String, index: true },
        BBox: [Number],
        BBoxWidth: Number,
        BBoxHeight: Number,
        BBoxDepth: Number,
        Volume: Number,
        NumberOfSeparateParts: Number,
        HistoryDateTime: Date,
        HistoryUserName: String,
        DicomType: String,
        Color: String,
        HasSegment: Boolean,
        IsHighResolution: Boolean,
        Comment: String,
        ROINumber: Number,
        MeshGeometryBounds: [Number],
        sset: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "StructureSet"
        },
        StructureSetId: String,
        pt: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Patient"
        },
        PatientId: String,
        plansetup: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "PlanSetup"
        },
        PlanSetupId: {type: String, default: "", index: true},
        PlanType: {type: String, default: "", index: true},
        TreatmentOrientation: {type: String, default: "", index: true},
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Structure', StructureSchema);


