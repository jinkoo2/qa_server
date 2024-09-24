
const mongoose = require('mongoose');

const StructureSetSchema = mongoose.Schema(
    {
        Id: String,
        Comment: String,
        HistoryDateTime: Date,
        HistoryUserName: String,
        UID: String,
        s_list: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Structure"
        }],
        img: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Image"
        },
        ImageId: String,
        pt: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Patient"
        },
        PatientId: String,
    },
    {
        timestamps: false
    }
);

module.exports = mongoose.model('StructureSet', StructureSetSchema);


