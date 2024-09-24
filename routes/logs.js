var express = require('express');
var router = express.Router();
var Log = require('../models/log');
const authorizedOnly = require('../security/authorizedOnly');

/* GET ALL LOGS */
router.get('/', authorizedOnly, function(req, res, next) {
  
    console.log('get');
    Log.find()
    .sort([['updatedAt', -1]])
    .then(data=>{
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.log('err');
        res.json({message: err});
    });
});

/* GET ALL LOGS OF an Object */
router.get('/object_id/:object_id', authorizedOnly , function(req, res, next) {
  
    // new start lower limit
    const object_id = req.params.object_id;

    console.log(req.url);

    var options = { object_id: object_id }

    //console.log('get');
    Log.find(options)
    .sort([['updatedAt', -1]])
    .then(data=>{
        //console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.log('err');
        res.json({message: err});
    });
});

/* DELETE A LOG */
router.delete('/:logId', authorizedOnly, function(req, res, next) {
  
    const logId = req.params.logId;
    console.log(logId);
    
    Log.remove({_id:logId})
    .then(data=>{
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.log('err');
        res.json({message: err});
    });
});

/* DELETE ALL logs of an object */
router.delete('/object/:object_id', authorizedOnly, function(req, res, next) {
  
    const object_id = req.params.object_id;
    console.log(object_id);
    
    Log.remove({object_id:object_id})
    .then(data=>{
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.log('err');
        res.json({message: err});
    });
});

// POST A LOG
router.post('/', authorizedOnly, function(req, res, next) {

  console.log(req.body);

  const log = new Log(req.body);

  log.save()
  .then(data =>{
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
