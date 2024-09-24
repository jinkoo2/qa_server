const mongoose = require('mongoose');

const TensorBoardSchema = mongoose.Schema(
    {
        trainingjob_id: mongoose.SchemaTypes.ObjectId,
        status: String,
        pid: Number,
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('TensorBoard', TensorBoardSchema);