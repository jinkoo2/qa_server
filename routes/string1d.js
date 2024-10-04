
const express = require('express');
const router = express.Router();
const String1D = require('../models/string1d');

// CREATE: Add one or more measurements (POST /api/measurements)
router.post('/', async (req, res) => {
    try {
        const measurements = req.body; // Request body can be a single object or an array

        // Check if the body is an array of objects
        if (Array.isArray(measurements)) {
            // If it's an array, use insertMany for bulk insert
            const savedMeasurements = await String1D.insertMany(measurements);
            res.status(201).json(savedMeasurements);
        } else {
            // If it's a single object, use save for a single document
            const measurement = new String1D(measurements);
            const savedMeasurement = await measurement.save();
            res.status(201).json(savedMeasurement);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ: Get all measurements (GET /api/measurements)
router.get('/', async (req, res) => {
    try {
        const measurements = await String1D.find().sort({ createdAt: -1 });
        res.json(measurements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ: Get a measurement by ID (GET /api/measurements/:id)
router.get('/:id', async (req, res) => {
    try {
        const measurement = await String1D.findById(req.params.id);
        if (!measurement) return res.status(404).json({ message: 'Measurement not found' });
        res.json(measurement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE: Update a measurement by ID (PUT /api/measurements/:id)
router.put('/:id', async (req, res) => {
    try {
        const updatedMeasurement = await String1D.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMeasurement) return res.status(404).json({ message: 'Measurement not found' });
        res.json(updatedMeasurement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Delete a measurement by ID (DELETE /api/measurements/:id)
router.delete('/:id', async (req, res) => {
    try {
        const deletedMeasurement = await String1D.findByIdAndRemove(req.params.id);
        if (!deletedMeasurement) return res.status(404).json({ message: 'Measurement not found' });
        res.json({ message: 'Measurement deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
