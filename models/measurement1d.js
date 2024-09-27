const mongoose = require('mongoose');

const Measurement1DSchema = new mongoose.Schema(
    {
        // machine id, device id, etc
        device_id: {
            type: String,
            required: true,
            index: true  // Single field index on object_id
        },

        // room1_temperature, pressure etc
        series_id: {
            type: String,
            required: true,
            index: true  // Single field index on measurement_id
        },

        time: {
            type: Date,
            required: true
        },

        value: {
            type: Number,
            required: true
        },

        notes: String,
        by: String,
        app: String,
    },
    {
        timestamps: true
    }
);

// Define a compound index for object_id and measurement_id
Measurement1DSchema.index({ object_id: 1, series_id: 1 });

module.exports = mongoose.model('Measurement1D', Measurement1DSchema);
