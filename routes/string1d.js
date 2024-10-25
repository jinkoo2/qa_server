
const express = require('express');
const router = express.Router();
const String1D = require('../models/string1d');

// CREATE: Add one or more measurements (POST /api/measurements)
router.post('/', async (req, res) => {
    try {
        let data = req.body;

        // Normalize time fields in the request body
        if (Array.isArray(data)) {
            data = data.map(item => ({
                ...item,
                time: new Date(item.time)
            }));
        } else {
            data.time = new Date(data.time);
        }

        if (Array.isArray(data)) {

            // remove empty value string
            
            const savedItems = await String1D.insertMany(data, { ordered: true });
            res.status(201).json(savedItems);
        } else {
            const string1d = new String1D(data);
            const savedItem = await string1d.save();
            res.status(201).json(savedItem);
        }
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ message: 'Validation failed', errors: err.errors });
        } else {
            res.status(500).json({ message: 'Internal server error', error: err.message });
        }
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
