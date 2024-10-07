const express = require('express');
const router = express.Router();
const Number1D = require('../models/number1d');

// CREATE: Add one or more measurements (POST /api/measurements)
router.post('/', async (req, res) => {
    try {
        const measurements = req.body; // Request body can be a single object or an array

        // Check if the body is an array of objects
        if (Array.isArray(measurements)) {
            // If it's an array, use insertMany for bulk insert
            const savedMeasurements = await Number1D.insertMany(measurements);
            res.status(201).json(savedMeasurements);
        } else {
            // If it's a single object, use save for a single document
            const measurement = new Number1D(measurements);
            const savedMeasurement = await measurement.save();
            res.status(201).json(savedMeasurement);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/*
// READ: Get all measurements (GET /api/measurements)
router.get('/', async (req, res) => {
    try {
        const measurements = await Number1D.find().sort({ createdAt: -1 });
        res.json(measurements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
*/
// GET endpoint to fetch data based on query parameters
router.get('/', async (req, res) => {
    const { device_id, series_id, start_date, end_date } = req.query;

    try {
        // Build query object
        const query = {
            device_id: device_id,
            series_id: series_id
        };

        // Add date range filter to query if start_date and end_date are provided
        if (start_date && end_date) {
            query.time = {
                $gte: new Date(start_date), // Start date
                $lte: new Date(end_date) // End date
            };
        }

        // Retrieve data from MongoDB
        const results = await Number1D.find(query).sort({ time: 1 }); // Sort by time ascending

        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});


// READ: Get a measurement by ID (GET /api/measurements/:id)
router.get('/:id', async (req, res) => {
    try {
        const measurement = await Number1D.findById(req.params.id);
        if (!measurement) return res.status(404).json({ message: 'Measurement not found' });
        res.json(measurement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE: Update a measurement by ID (PUT /api/measurements/:id)
router.put('/:id', async (req, res) => {
    try {
        const updatedMeasurement = await Number1D.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMeasurement) return res.status(404).json({ message: 'Measurement not found' });
        res.json(updatedMeasurement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Delete a measurement by ID (DELETE /api/measurements/:id)
router.delete('/:id', async (req, res) => {
    try {
        const deletedMeasurement = await Number1D.findByIdAndRemove(req.params.id);
        if (!deletedMeasurement) return res.status(404).json({ message: 'Measurement not found' });
        res.json({ message: 'Measurement deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Add this route to your Express router
router.get('/device/ids', async (req, res) => {
    try {
        // Retrieve all unique device_ids
        const deviceIds = await Number1D.distinct('device_id');
        res.json(deviceIds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add this route to your Express router to fetch series_ids based on device_id
router.get('/series/ids', async (req, res) => {
    const { device_id } = req.query;

    if (!device_id) {
        return res.status(400).json({ error: "device_id is required" });
    }

    try {
        // Retrieve all unique series_ids for the provided device_id
        const seriesIds = await Number1D.find({ device_id }).distinct('series_id');
        res.json(seriesIds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
