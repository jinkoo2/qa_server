var express = require('express');
var router = express.Router();
var Fc2Result = require('../models/fc2result'); // Adjust the path as needed

/* GET ALL Fc2Results */
router.get('/', function(req, res, next) {
    console.log('Fetching all Fc2Results');
    Fc2Result.find()
        .sort([['updatedAt', -1]]) // Sort by most recently updated
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.log('Error fetching results:', err);
            res.status(500).json({ message: err.message });
        });
});

/* GET Fc2Result by ID */
router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    console.log('Fetching Fc2Result by ID:', id);

    Fc2Result.findById(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'Result not found' });
            }
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.log('Error fetching result by ID:', err);
            res.status(500).json({ message: err.message });
        });
});

/* POST a new Fc2Result */
router.post('/', function(req, res, next) {
    console.log('Creating a new Fc2Result:', req.body);

    const fc2Result = new Fc2Result(req.body);

    fc2Result.save()
        .then(data => {
            console.log('Fc2Result saved successfully');
            res.status(201).json(data); // Send 201 status for created resource
        })
        .catch(err => {
            console.log('Error saving Fc2Result:', err);
            res.status(400).json({ message: err.message });
        });
});

/* DELETE a Fc2Result by ID */
router.delete('/:id', function(req, res, next) {
    const id = req.params.id;
    console.log('Deleting Fc2Result by ID:', id);

    Fc2Result.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'Result not found' });
            }
            console.log('Deleted Fc2Result:', data);
            res.json({ message: 'Fc2Result deleted successfully', data });
        })
        .catch(err => {
            console.log('Error deleting result:', err);
            res.status(500).json({ message: err.message });
        });
});

/* PUT (Update) a Fc2Result by ID */
router.put('/:id', function(req, res, next) {
    const id = req.params.id;
    console.log('Updating Fc2Result by ID:', id);

    Fc2Result.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        .then(data => {
            if (!data) {
                return res.status(404).json({ message: 'Result not found' });
            }
            console.log('Updated Fc2Result:', data);
            res.json(data);
        })
        .catch(err => {
            console.log('Error updating result:', err);
            res.status(400).json({ message: err.message });
        });
});

module.exports = router;
