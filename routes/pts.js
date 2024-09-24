var express = require('express');
var router = express.Router();
var Pt = require('../models/pt');
fs = require('fs')

/* GET ALL pts */
router.get('/', function (req, res, next) {
    console.log('get');
    Pt.find({})
        //.select("sset_list")
        //.limit(1000)
        //.sort([['updatedAt', -1]])
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.log('err');
            res.json({ message: err });
        });
});

/* GET ALL sset_list */
router.get('/sset_list', function (req, res, next) {
    console.log('get');
    Pt.find({})
        .select("sset_list")
        //.limit(1000)
        //.sort([['updatedAt', -1]])
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.log('err');
            res.json({ message: err });
        });
});

/* GET ALL sset_list */
router.get('/sset_list/s_list', function (req, res, next) {
    console.log('get(/sset_list/s_list)');
    Pt.find({'sset_list.s_list.ROINumber': 25})
        .select("sset_list.s_list.ROINumber")
        //.limit(1000)
        //.sort([['updatedAt', -1]])
        .then(data => {
            console.log(data);
            res.json(data);
            //res.json({ name: 'Kim' })
        })
        .catch(err => {
            console.log('err');
            res.json({ message: err });
        });
});


// POST A PT
router.post('/', function (req, res, next) {

    console.log('----------- post -------------')
    console.log(req.body);

    // fs.writeFile('file.json', JSON.stringify(req.body), err=>{
    //     if(err) console.log(err)
    //     console.log('save to file.json')
    // })

    console.log(JSON.stringify(req.body))

    const pt = new Pt(req.body);

    pt.save()
        .then(data => {
            console.log('saved... sending the response back...');
            res.json(data);
        })
        .catch(err => {
            console.log('error saving a log...');
            res.json(
                {
                    message: err
                });
        });

}); // post()

module.exports = router;