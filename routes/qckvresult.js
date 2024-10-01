var express = require('express');
var router = express.Router();
var QckvResult = require('../models/qckvresult'); // Adjust the path as needed

/* GET ALL QckvResults */
router.get('/', function(req, res, next) {
    console.log('get all QckvResults');
    QckvResult.find()
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

/* GET QckvResult by ID */
router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    console.log('get QckvResult by ID:', id);

    QckvResult.findById(id)
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

/* POST a new QckvResult */
router.post('/', function(req, res, next) {
    console.log('Received data:', req.body);

    const qckvResult = new QckvResult(req.body);

    qckvResult.save()
    .then(data => {
        console.log('QckvResult saved... sending the response back...');
        res.status(201).json(data);
    })
    .catch(err => {
        console.log('error saving QckvResult:', err);
        res.status(400).json({ message: err.message });
    });
});

/* DELETE a QckvResult by ID */
router.delete('/:id', function(req, res, next) {
    const id = req.params.id;
    console.log('delete QckvResult by ID:', id);

    QckvResult.findByIdAndRemove(id)
    .then(data => {
        if (!data) {
            return res.status(404).json({ message: "Result not found" });
        }
        console.log('Deleted:', data);
        res.json({ message: 'QckvResult deleted successfully', data });
    })
    .catch(err => {
        console.log('err', err);
        res.status(500).json({ message: err.message });
    });
});

/* PUT (Update) a QckvResult by ID */
router.put('/:id', function(req, res, next) {
    const id = req.params.id;
    console.log('update QckvResult by ID:', id);

    QckvResult.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then(data => {
        if (!data) {
            return res.status(404).json({ message: "Result not found" });
        }
        console.log('QckvResult updated:', data);
        res.json(data);
    })
    .catch(err => {
        console.log('err', err);
        res.status(400).json({ message: err.message });
    });
});

module.exports = router;
