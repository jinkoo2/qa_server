const express = require('express');
const router = express.Router();
const LeedsTORResult = require('../models/leedstorresult'); // Adjust the path as needed

/* GET All LeedsTORResults */
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all LeedsTORResults');
        const results = await LeedsTORResult.find().sort([['updatedAt', -1]]); // Sort by most recently updated
        res.json(results);
    } catch (err) {
        console.error('Error fetching results:', err);
        res.status(500).json({ message: err.message });
    }
});

/* GET LeedsTORResult by ID */
router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching LeedsTORResult by ID:', req.params.id);
        const result = await LeedsTORResult.findById(req.params.id);
        if (!result) return res.status(404).json({ message: 'Result not found' });
        res.json(result);
    } catch (err) {
        console.error('Error fetching result by ID:', err);
        res.status(500).json({ message: err.message });
    }
});

/* POST a new LeedsTORResult */
router.post('/', async (req, res) => {
    try {
        console.log('Creating a new LeedsTORResult:', req.body);
        const newResult = new LeedsTORResult(req.body);
        const savedResult = await newResult.save();
        res.status(201).json(savedResult); // Send 201 status for created resource
    } catch (err) {
        console.error('Error saving LeedsTORResult:', err);
        res.status(400).json({ message: err.message });
    }
});

/* PUT (Update) a LeedsTORResult by ID */
router.put('/:id', async (req, res) => {
    try {
        console.log('Updating LeedsTORResult by ID:', req.params.id);
        const updatedResult = await LeedsTORResult.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedResult) return res.status(404).json({ message: 'Result not found' });
        res.json(updatedResult);
    } catch (err) {
        console.error('Error updating result:', err);
        res.status(400).json({ message: err.message });
    }
});

/* DELETE a LeedsTORResult by ID */
router.delete('/:id', async (req, res) => {
    try {
        console.log('Deleting LeedsTORResult by ID:', req.params.id);
        const deletedResult = await LeedsTORResult.findByIdAndRemove(req.params.id);
        if (!deletedResult) return res.status(404).json({ message: 'Result not found' });
        res.json({ message: 'LeedsTORResult deleted successfully', data: deletedResult });
    } catch (err) {
        console.error('Error deleting result:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
