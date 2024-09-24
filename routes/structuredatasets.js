var express = require('express');
var router = express.Router();
var StructureDataSet = require('../models/structuredataset');
//fs = require('fs')


/* GET ALL structure datasets */
router.get('/', function (req, res, next) {
    console.log('get all structure dataset');

    where = {}
    StructureDataSet.countDocuments(where, (err, totalCount) => {
        if (err) {
            console.error(err);
            res.json({ message: err });
        }
        else {
            StructureDataSet.find(where)
                // .populate({
                //     path: 'pt',
                //     //select: 'Id Sex', 
                //     model: 'Patient'
                // })
                // .populate({
                //     path: 'plansetup',
                //     //select: 'Id', 
                //     model: 'PlanSetup'
                // })
                // .populate({
                //     path: 'sset',
                //     //select: 'Id', 
                //     model: 'StructureSet'
                // })
                // .skip(skip)
                // .limit(limit)
                // .sort([[filter.SortBy, filter.SortIncrement ? 1 : -1]])
                .exec((err, data) => {
                    if (err) {
                        console.error(err);
                        res.json({ message: err });
                    }
                    else {
                        const ret = {
                            totalCount: totalCount,
                            list: data
                        }
    
                        res.json(ret);
                    }
                })
    
        }
    
    })
});


/* GET A DataSet */
router.get('/:dataSetId', function(req, res, next) {
  
    const dataSetId = req.params.dataSetId;
    console.log(dataSetId);
    
    StructureDataSet.findOne({_id:dataSetId})
    // .populate({path: 'TrainSet',
    //             model: 'Structure',
    //             select: 'Name'})
    .populate('TrainSet')
    .populate('ValidSet')
    .populate('TestSet')
    .then(data=>{
        
        console.log("returning a plan", `returning a plan(${dataSetId})`, req)

        res.json(data);
    })
    .catch(err => {
        console.error(err);
        
        console.error("returning a plan failed", `returning a plan failed(${dataSetId})`, req)

        res.json({message: err});
    });
});

function filter2where(filter){
    var where = {}
    if (filter.Name !== "")
        if (filter.NameExactMatch)
            where.Name = { $regex: filter.Name.toLowerCase().trim() + '/i' }
        else
            where.Name = { $regex: '.*' + filter.Name.toLowerCase().trim() + '.*/i' }

    return where;
}

// get datasets with filter
router.post('/filtered', function (req, res, next) {

    filter = req.body

    console.log('----------- structuredataset/filtered -------------')
    console.log('filter=', filter);

    // convert to where condision
    var where = filter2where(filter)

    // pagenation
    const skip = filter.ItemsPerPage * filter.PageNumber
    const limit = filter.ItemsPerPage

    console.log('find');
    console.log('where', where)

    StructureDataSet.countDocuments(where, (err, totalCount) => {
        if (err) {
            console.error(err);
            res.json({ message: err });
        }
        else {
            StructureDataSet.find(where)
                // .populate({
                //     path: 'pt',
                //     //select: 'Id Sex', 
                //     model: 'Patient'
                // })
                // .populate({
                //     path: 'plansetup',
                //     //select: 'Id', 
                //     model: 'PlanSetup'
                // })
                // .populate({
                //     path: 'sset',
                //     //select: 'Id', 
                //     model: 'StructureSet'
                // })
                //.select("sset_list")
                .skip(skip)
                .limit(limit)
                //.sort([[filter.SortBy, filter.SortIncrement ? 1 : -1]])
                .exec((err, data) => {
                    if (err) {
                        console.error(err);
                        res.json({ message: err });
                    }
                    else {
                        const ret = {
                            totalCount: totalCount,
                            list: data
                        }

                        res.json(ret);
                    }
                })

        }

    })







}); // post()

// POST A Dataset
router.post('/', function (req, res, next) {
    
    console.log('----------- post -------------')
    console.log(req.body);

    // fs.writeFile('file.json', JSON.stringify(req.body), err=>{
    //     if(err) console.log(err)
    //     console.log('save to file.json')
    // })

    console.log(JSON.stringify(req.body))

    const structureDataSet = new StructureDataSet(req.body);

    structureDataSet.save()
        .then(data => {
            console.log('saved... sending the response back...');
            console.log(data)
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

/* DELETE A DS */
router.delete('/:dataSetId', function(req, res, next) {
  
    const dataSetId = req.params.dataSetId;
    console.log('deleting...',dataSetId);
    
    StructureDataSet.remove({_id:dataSetId})
    .then(data=>{
        
        console.log("dataset deleted", `dataset deleted(${dataSetId})`, req)

        res.json(data);
    })
    .catch(err => {
        console.error(err);

        console.error("dataset delete failed", `dataset delete failed(${dataSetId})`, req)

        res.json({message: err});
    });
});

module.exports = router;