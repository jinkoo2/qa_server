const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema(
    {
        Id: String,
        Comment: String,
        CreationDateTime: Date,
        DisplayUnit: String,
        FOR: String,
        ImagingOrientation: String,
        HasUserOrigin: Boolean,
        HistoryDateTime: Date,
        HistoryUserName: String,
        Series: String,
        Level: Number,
        Window: Number,
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

module.exports = mongoose.model('Image', ImageSchema);