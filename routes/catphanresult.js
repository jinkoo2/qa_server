var express = require('express');
var router = express.Router();
var CatPhanResult = require('../models/catphanresult');

/* GET ALL CatPhanResults */
router.get('/', function(req, res, next) {
  
    console.log('get all CatPhanResults');
    CatPhanResult.find()
    .sort([['updatedAt', -1]])
    .then(data => {
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.log('err');
        res.json({ message: err });
    });
});

/* GET CatPhanResult by ID */
router.get('/:id', function(req, res, next) {
  
    const id = req.params.id;
    console.log('get CatPhanResult by ID:', id);

    CatPhanResult.findById(id)
    .then(data => {
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.log('err');
        res.json({ message: err });
    });
});

/* POST a new CatPhanResult */
router.post('/', function(req, res, next) {

    console.log(req.body);

    const catPhanResult = new CatPhanResult(req.body);

    catPhanResult.save()
    .then(data => {
        console.log('CatPhanResult saved... sending the response back...');
        res.json(data);
    })
    .catch(err => {
        console.log('error saving CatPhanResult...');
        res.json({ message: err });
    });

});

/* DELETE a CatPhanResult by ID */
router.delete('/:id', function(req, res, next) {

    const id = req.params.id;
    console.log('delete CatPhanResult by ID:', id);

    CatPhanResult.findByIdAndRemove(id)
    .then(data => {
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.log('err');
        res.json({ message: err });
    });

});

/* PUT (Update) a CatPhanResult by ID */
router.put('/:id', function(req, res, next) {

    const id = req.params.id;
    console.log('update CatPhanResult by ID:', id);

    CatPhanResult.findByIdAndUpdate(id, req.body, { new: true })
    .then(data => {
        console.log('CatPhanResult updated:', data);
        res.json(data);
    })
    .catch(err => {
        console.log('err');
        res.json({ message: err });
    });

});

module.exports = router;
