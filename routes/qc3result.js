var express = require('express');
var router = express.Router();
var Qc3Result = require('../models/qc3result'); // Adjust the path as needed

/* GET ALL Qc3Results */
router.get('/', function(req, res, next) {
    console.log('get all Qc3Results');
    Qc3Result.find()
    .sort([['updatedAt', -1]]) // Sort by the most recently updated
    .then(data => {
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.log('err', err);
        res.status(500).json({ message: err.message });
    });
});

/* GET Qc3Result by ID */
router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    console.log('get Qc3Result by ID:', id);

    Qc3Result.findById(id)
    .then(data => {
        if (!data) {
            return res.status(404).json({ message: "Result not found" });
        }
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.log('err', err);
        res.status(500).json({ message: err.message });
    });
});

/* POST a new Qc3Result */
router.post('/', function(req, res, next) {
    console.log('Received data:', req.body);

    const qc3Result = new Qc3Result(req.body);

    qc3Result.save()
    .then(data => {
        console.log('Qc3Result saved... sending the response back...');
        res.status(201).json(data);
    })
    .catch(err => {
        console.log('error saving Qc3Result:', err);
        res.status(400).json({ message: err.message });
    });
});

/* DELETE a Qc3Result by ID */
router.delete('/:id', function(req, res, next) {
    const id = req.params.id;
    console.log('delete Qc3Result by ID:', id);

    Qc3Result.findByIdAndRemove(id)
    .then(data => {
        if (!data) {
            return res.status(404).json({ message: "Result not found" });
        }
        console.log('Deleted:', data);
        res.json({ message: 'Qc3Result deleted successfully', data });
    })
    .catch(err => {
        console.log('err', err);
        res.status(500).json({ message: err.message });
    });
});

/* PUT (Update) a Qc3Result by ID */
router.put('/:id', function(req, res, next) {
    const id = req.params.id;
    console.log('update Qc3Result by ID:', id);

    Qc3Result.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then(data => {
        if (!data) {
            return res.status(404).json({ message: "Result not found" });
        }
        console.log('Qc3Result updated:', data);
        res.json(data);
    })
    .catch(err => {
        console.log('err', err);
        res.status(400).json({ message: err.message });
    });
});

module.exports = router;
