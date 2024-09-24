const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema(
    {
        Id: {
            type: String,
            //        required:true, 
            //unique: true,
        },

        pt: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Patient"
        },
    },
    {
        timestamps: false
    }
);

module.exports = mongoose.model('Course', CourseSchema);