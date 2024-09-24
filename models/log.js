const mongoose = require('mongoose');

const LogSchema = mongoose.Schema(
    {
        object_id: {
            type: String,
            required: true
        },
        title: String,
        msg: String,
        by: String,
        app: String,
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('Log', LogSchema);