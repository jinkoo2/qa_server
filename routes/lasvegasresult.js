const express = require('express');
const router = express.Router();
const LasVegasResult = require('../models/lasvegasresult'); // Adjust the path as necessary

/* GET all LasVegasResults */
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all LasVegasResults');
        const results = await LasVegasResult.find().sort({ updatedAt: -1 }); // Sort by most recent
        res.json(results);
    } catch (err) {
        console.error('Error fetching results:', err);
        res.status(500).json({ message: err.message });
    }
});

/* GET LasVegasResult by ID */
router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching LasVegasResult by ID:', req.params.id);
        const result = await LasVegasResult.findById(req.params.id);
        if (!result) return res.status(404).json({ message: 'Result not found' });
        res.json(result);
    } catch (err) {
        console.error('Error fetching result by ID:', err);
        res.status(500).json({ message: err.message });
    }
});

/* POST a new LasVegasResult */
router.post('/', async (req, res) => {
    try {
        console.log('Creating a new LasVegasResult:', req.body);
        const newResult = new LasVegasResult(req.body);
        const savedResult = await newResult.save();
        res.status(201).json(savedResult); // Return 201 status for a successful creation
    } catch (err) {
        console.error('Error saving LasVegasResult:', err);
        res.status(400).json({ message: err.message });
    }
});

/* PUT (Update) LasVegasResult by ID */
router.put('/:id', async (req, res) => {
    try {
        console.log('Updating LasVegasResult by ID:', req.params.id);
        const updatedResult = await LasVegasResult.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validation
        });
        if (!updatedResult) return res.status(404).json({ message: 'Result not found' });
        res.json(updatedResult);
    } catch (err) {
        console.error('Error updating result:', err);
        res.status(400).json({ message: err.message });
    }
});

/* DELETE LasVegasResult by ID */
router.delete('/:id', async (req, res) => {
    try {
        console.log('Deleting LasVegasResult by ID:', req.params.id);
        const deletedResult = await LasVegasResult.findByIdAndRemove(req.params.id);
        if (!deletedResult) return res.status(404).json({ message: 'Result not found' });
        res.json({ message: 'LasVegasResult deleted successfully', data: deletedResult });
    } catch (err) {
        console.error('Error deleting result:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
