var express = require('express');
var router = express.Router();
var Log = require('../models/log');
// const authorizedOnly = require('../security/authorizedOnly');
const fs = require('fs')
const path = require('path')


router.get('/', function(req, res, next) {
    fs.readFile(path.join(__dirname, 'enum.json'), (err, data)=>{
        if(err)
        {
            console.error(err);
            res.status(500)
            res.json({err: "data not found"})
        }    
        
        const obj = JSON.parse(data);
        
        res.json(obj);
    })
});

router.get('/:prop_name', function(req, res, next) {

    const prop_name = req.params.prop_name;

    fs.readFile(path.join(__dirname, 'enum.json'), (err, data)=>{
        if(err)
        {
            console.error(err);
            res.status(500)
            res.json({err: "data not found"})
        }    
        
        const enumList = JSON.parse(data);

        const prop_value = enumList[prop_name]

        res.json(prop_value);
    })
});


module.exports = router;
