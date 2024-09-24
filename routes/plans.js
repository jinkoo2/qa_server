var express = require('express');
var router = express.Router();
var Plan = require('../models/plan');
const authorizedOnly = require('../security/authorizedOnly');
const appLogger = require('../security/appLogger')

/* GET ALL PLANNING CASES */
router.get('/', authorizedOnly, function(req, res, next) {

    //console.log('get');
    Plan.find()
         //.select(['-search']) // exclude search string
        .sort({ newstart : 'asc' })
        .exec((err, data)=>{
        if(err){
            console.error(err);
            appLogger.error("returning plans failed", "returning plans failed", req)
            res.json({message: err});
        }
        else{
            appLogger.log("returning plans", "returning plans", req)
            // console.log('data===================>', data)
            res.json(data);
        }
    })
    
});


/* GET ALL PLANNING CASES */
/* where newstart > t0 */
router.get('/newstart/gt/:t0', authorizedOnly, function(req, res, next) {
  
    // new start lower limit
    const t0 = req.params.t0;

    var options = { newstart: {$gt: t0}}

    //console.log('get');
    Plan.find(options)
        //.select(['-search']) // exclude search field
        .sort({ newstart : 'asc' })
        .exec((err, data)=>{
        if(err){
            console.error(err);
            appLogger.error("returning plans failed", "returning plans failed", req)
            res.json({message: err});
        }
        else{
            appLogger.log("returning plans", "returning plans", req)
            // console.log('data===================>', data)
            res.json(data);
        }
    })
});

/* GET ALL PLANNING CASES */
/* where newstart > t0 */
router.get('/newstart/gt/:t0/lt/:t1', authorizedOnly, function(req, res, next) {
  
    // new start lower limit
    const t0 = req.params.t0;
    const t1 = req.params.t1;

    var options = { newstart: {$gt: t0, $lt: t1}}
    Plan.find(options)
    //.select(['-search']) // exclude search field
    .sort({ newstart : 'asc' })
    .limit(10)
    .skip(1)
    .exec((err, data)=>{
        if(err){
            console.error(err);
            appLogger.error("returning plans failed", "returning plans failed", req)
            res.json({message: err});
        }
        else{
            appLogger.log("returning plans", "returning plans", req)
            
            res.json(data);
        }
    })
});

router.get('/newstart/gt/:t0/lt/:t1/skip/:skip/limit/:limit', authorizedOnly, function(req, res, next) {
  
    // new start lower limit
    const t0 = req.params.t0;
    const t1 = req.params.t1;
    const skip = parseInt(req.params.skip);
    const limit = parseInt(req.params.limit);

    const options = { newstart: {$gt: t0, $lt: t1}}

    Plan.countDocuments(options, (err,totalCount)=>{
        if(err)
        {
            console.error(err);
            console.error(err);
            appLogger.error("returning plans failed", "returning plans failed", req)
            res.json({message: err});
        }
        else
        {
            Plan.find(options)
                //.select(['-json']) // exclude json field
                .sort({ newstart : 'asc' })
                .skip(skip)
                .limit(limit)
                .exec((err, data)=>{
                    if(err){
                        console.error(err);
                        appLogger.error("returning plans failed", "returning plans failed", req)
                        res.json({message: err});
                    }
                    else{
                        appLogger.log("returning plans", "returning plans", req)
                        // console.log('data===================>', data)
                        const ret = {
                            totalCount: totalCount,
                            list: data
                        }
                        res.json(ret);
                    }
                })

        }
            
    });
});


router.get('/newstart/gt/:t0/lt/:t1/keyword/:keyword/skip/:skip/limit/:limit', authorizedOnly, function(req, res, next) {
  
    // new start lower limit
    const t0 = req.params.t0;
    const t1 = req.params.t1;
    const keyword = req.params.keyword;
    const skip = parseInt(req.params.skip);
    const limit = parseInt(req.params.limit);

    // console.log('skip===>', skip);
    // console.log('limit===>', limit);

    const regex = new RegExp(keyword, 'i')

    const options = { 
        newstart: {
            $gt: t0, 
            $lt: t1},
        keywords: regex
    }

    // console.log('============ plan search ============');
    // console.log('t0===>', t0);
    // console.log('t1===>', t1);
    // console.log('keyword===>', keyword);
    // console.log('skip===>', skip);
    // console.log('limit===>', limit);


    Plan.countDocuments(options, (err,totalCount)=>{
        if(err)
        {
            console.error(err);
            console.error(err);
            appLogger.error("returning plans failed", "returning plans failed", req)
            res.json({message: err});
        }
        else
        {
            Plan.find(options)
                //.select(['-json']) // exclude json field
                .sort({ newstart : 'asc' })
                .skip(skip)
                .limit(limit)
                .exec((err, data)=>{
                    if(err){
                        console.error(err);
                        appLogger.error("returning plans failed", "returning plans failed", req)
                        res.json({message: err});
                    }
                    else{
                        appLogger.log("returning plans", "returning plans", req)
                        // console.log('data===================>', data)
                        const ret = {
                            totalCount: totalCount,
                            list: data
                        }
                        res.json(ret);
                    }
                })

        }
            
    });
});

router.get('/newstart/gt/:t0/lt/:t1/machines/:machines/skip/:skip/limit/:limit', authorizedOnly, function(req, res, next) {
  
    // new start lower limit
    const t0 = req.params.t0;
    const t1 = req.params.t1;
    const machines = req.params.machines.split(',').join('|');
    const skip = parseInt(req.params.skip);
    const limit = parseInt(req.params.limit);

    //console.log('machines====>', machines)

    const regexMachine = new RegExp(machines)

    const options = { 
        newstart: {$gt: t0, $lt: t1},
        machine: regexMachine
    }
    
    Plan.countDocuments(options, (err,totalCount)=>{
        if(err)
        {
            console.error(err);
            console.error(err);
            appLogger.error("returning plans failed", "returning plans failed", req)
            res.json({message: err});
        }
        else
        {
            Plan.find(options)
                //.select(['-json']) // exclude json field
                .sort({ newstart : 'asc' })
                .skip(skip)
                .limit(limit)
                .exec((err, data)=>{
                    if(err){
                        console.error(err);
                        appLogger.error("returning plans failed", "returning plans failed", req)
                        res.json({message: err});
                    }
                    else{
                        appLogger.log("returning plans", "returning plans", req)
                        // console.log('data===================>', data)
                        const ret = {
                            totalCount: totalCount,
                            list: data
                        }
                        res.json(ret);
                    }
                })

        }
            
    });
});


router.get('/newstart/gt/:t0/lt/:t1/keyword/:keyword/machines/:machines/skip/:skip/limit/:limit', authorizedOnly, function(req, res, next) {
  
    // new start lower limit
    const t0 = req.params.t0;
    const t1 = req.params.t1;
    const keyword = req.params.keyword;
    const machines = req.params.machines.split(',').join('|');
    const skip = parseInt(req.params.skip);
    const limit = parseInt(req.params.limit);

    //console.log('machines===>', machines);
    // console.log('limit===>', limit);

    const regexKeyword = new RegExp(keyword, 'i')
    const regexMachine = new RegExp(machines)
    const options = { 
        newstart: {
            $gt: t0, 
            $lt: t1},
        keywords: regexKeyword,
        machine: regexMachine
    }

    // console.log('============ plan search ============');
    // console.log('t0===>', t0);
    // console.log('t1===>', t1);
    // console.log('keyword===>', keyword);
    // console.log('skip===>', skip);
    // console.log('limit===>', limit);


    Plan.countDocuments(options, (err,totalCount)=>{
        if(err)
        {
            console.error(err);
            console.error(err);
            appLogger.error("returning plans failed", "returning plans failed", req)
            res.json({message: err});
        }
        else
        {
            Plan.find(options)
                //.select(['-json']) // exclude json field
                .sort({ newstart : 'asc' })
                .skip(skip)
                .limit(limit)
                .exec((err, data)=>{
                    if(err){
                        console.error(err);
                        appLogger.error("returning plans failed", "returning plans failed", req)
                        res.json({message: err});
                    }
                    else{
                        appLogger.log("returning plans", "returning plans", req)
                        // console.log('data===================>', data)
                        const ret = {
                            totalCount: totalCount,
                            list: data
                        }
                        res.json(ret);
                    }
                })

        }
            
    });
});

router.get('/keyword/:keyword/skip/:skip/limit/:limit', authorizedOnly, function(req, res, next) {
  
    // new start lower limit
    const keyword = req.params.keyword.trim().toLowerCase();
    const skip = parseInt(req.params.skip);
    const limit = parseInt(req.params.limit);

    // console.log('============ plan search ============');
    // console.log('keyword===>', keyword);
    // console.log('skip===>', skip);
    // console.log('limit===>', limit);

    // {name: {$regex: name, $options: 'i'}

    const regex = new RegExp(keyword, 'i')

    const options = {keywords: regex}

    Plan.countDocuments(options, (err,totalCount)=>{
        if(err)
        {
            console.error(err);
            console.error(err);
            appLogger.error("returning plans failed", "returning plans failed", req)
            res.json({message: err});
        }
        else
        {
            // console.log('totalCount=', totalCount)
            Plan.find(options)
                //.select(['-json']) // exclude json field
                .sort({ newstart : 'asc' })
                .skip(skip)
                .limit(limit)
                .exec((err, data)=>{
                    if(err){
                        console.error(err);
                        appLogger.error("returning plans failed", "returning plans failed", req)
                        res.json({message: err});
                    }
                    else{
                        appLogger.log("returning plans", "returning plans", req)
                        // console.log('data===================>', data)
                        const ret = {
                            totalCount: totalCount,
                            list: data
                        }

                        // console.log('ret=================>', ret)

                        res.json(ret);
                    }
                })

        }
            
    });
});

/* GET A PLANNING CASE */
router.get('/:planId', authorizedOnly, function(req, res, next) {
  
    const planId = req.params.planId;
    //console.log(planId);
    
    Plan.findOne({_id:planId})
    .then(data=>{
        
        appLogger.log("returning a plan", `returning a plan(${planId})`, req)

        res.json(data);
    })
    .catch(err => {
        console.error(err);
        
        appLogger.error("returning a plan failed", `returning a plan failed(${planId})`, req)

        res.json({message: err});
    });
});

/* DELETE A PLANNING CASE */
router.delete('/:planId', authorizedOnly, function(req, res, next) {
  
    const planId = req.params.planId;
    //console.log(planId);
    
    Plan.remove({_id:planId})
    .then(data=>{
        
        appLogger.log("plan deleted", `plan deleted(${planId})`, req)

        res.json(data);
    })
    .catch(err => {
        console.error(err);

        appLogger.error("plan delete failed", `plan delete failed(${planId})`, req)

        res.json({message: err});
    });
});

/* DELETE A PLANNING CASE */
// router.delete('/:planId', authorizedOnly, function(req, res, next) {
  
//     const planId = req.params.planId;
//     //console.log(planId);
    
//     Plan.remove({_id:planId})
//     .then(data=>{
//         //console.log(data);
//         res.json(data);
//     })
//     .catch(err => {
//         console.log('err');
//         res.json({message: err});
//     });
// });

/* UPDATE A PLANNING CASE */
router.patch('/:planId', authorizedOnly, function(req, res, next) {
  
    const planId = req.params.planId;
    
    Plan.updateOne({_id:planId},{
        $set: req.body
    })
    .then(data=>{
        
        // console.log(data);
        appLogger.log("plan updated", `plan updated(${planId})`, req)

        res.json(data);
    })
    .catch(err => {
        console.error(err);

        appLogger.error("plan update failed", `plan update failed(${planId})`, req)

        res.json({message: err});
    });
});

// POST A PLANNING CASE
router.post('/', authorizedOnly, function(req, res, next) {

// console.log(req.body)

  const plan = new Plan(req.body);

  plan.save()
  .then(data =>{
      //console.log('saved... sending the response back...');

      appLogger.log("a new plan added", 'a new plan added', req)

      res.json(data);
  })
  .catch(err => {
    console.error('error saving a plan case...', err);

    appLogger.error('plan add failed', 'plan add failed', req)

    res.json(
        {
            message: err
        });
  });

}); // post()

module.exports = router;
