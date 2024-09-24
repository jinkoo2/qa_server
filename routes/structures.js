var express = require('express');
var router = express.Router();
var Structure = require('../models/structure');
var Patient = require('../models/patient');
var PlanSetup = require('../models/plansetup');
var StructureSet = require('../models/structureset');
fs = require('fs')

/* GET ALL structures */
router.get('/', function (req, res, next) {
    console.log('get');
    Structure.find({})
        .populate({
            path: 'pt',
            //select: 'Id Sex', 
            model: 'Patient'
        })
        .populate({
            path: 'plansetup',
            //select: 'Id', 
            model: 'PlanSetup'
        })
        .populate({
            path: 'sset',
            //select: 'Id', 
            model: 'StructureSet'
        })
        //.select("sset_list")
        //.limit(100)
        .sort([['HistoryDateTime', -1]])
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.log(err);
            res.json({ message: err });
        });
});


function encode_path(str){
    
    
    var encoded = str.replace(/\//g,'[slsh]')
    .replace(/#/g,'[srp]')
    .replace(/ /g,'[sp]')
    .replace(/\./g,'[dot]')
    .replace(/\\/g,'[bslsh]')
    .replace(/-/g,'[mns]')
    
    console.log(`encode_path:${str}--->${encoded}`)    

    return encoded
}

//findOne
router.get('/:_id', function(req, res, next) {

    // new start lower limit
    const _id = req.params._id;

    console.log('getting one structure of id:'+_id)
    //console.log('get');
    Structure.findById({_id})
    .populate('sset')
    .then(data=>{
        // file path
        const str_file_path = `${data.PatientId}/sset_list/${encode_path(data.StructureSetId)}/${encode_path(data.Name)}.mhd`
        const img_file_path = `${data.PatientId}/img_list/${encode_path(data.sset.ImageId)}/img.mhd`

        console.log(str_file_path)
        console.log(img_file_path)
        
        data._doc.str_file_path = str_file_path
        data._doc.img_file_path = img_file_path

        //console.log(data);
        res.json(data);
        
    })
    .catch(err => {
        console.log('err');
        res.json({message: err});
    });
});


function filter2where(filter){
    var where = {}
    if (filter.Name !== "")
        if (filter.NameExactMatch)
            where.NameLower = filter.Name.toLowerCase().trim()
        else
            where.NameLower = { $regex: '.*' + filter.Name.toLowerCase().trim() + '.*' }

    if (filter.PlanType !== "Any")
        where.PlanType = filter.PlanType

    if (filter.TreatmentOrientation !== "Any")
        where.TreatmentOrientation = filter.TreatmentOrientation

    if (filter.VolumeFilterEnabled) {
        const min = filter.VolumeMin;
        const max = filter.VolumeMax;
        where.Volume = { $gte: min, $lte: max }
    }

    if (filter.SegmentsFilterEnabled) {
        const min = filter.SegmentsMin;
        const max = filter.SegmentsMax;
        where.NumberOfSeparateParts = { $gte: min, $lte: max }
    }

    if (filter.BBoxWidthFilterEnabled) {
        const min = filter.BBoxWidthMin;
        const max = filter.BBoxWidthMax;
        where.BBoxWidth = { $gte: min, $lte: max }
    }


    if (filter.BBoxHeightFilterEnabled) {
        const min = filter.BBoxHeightMin;
        const max = filter.BBoxHeightMax;
        where.BBoxHeight = { $gte: min, $lte: max }
    }


    if (filter.BBoxDepthFilterEnabled) {
        const min = filter.BBoxDepthMin;
        const max = filter.BBoxDepthMax;
        where.BBoxDepth = { $gte: min, $lte: max }
    }

    return where;
}

// get structures with filter
router.post('/filtered', function (req, res, next) {

    filter = req.body

    console.log('----------- /filtered -------------')
    console.log('filter=', filter);

    // convert to where condision
    var where = filter2where(filter)

    // pagenation
    const skip = filter.ItemsPerPage * filter.PageNumber
    const limit = filter.ItemsPerPage

    console.log('find');
    console.log('where', where)

    Structure.countDocuments(where, (err, totalCount) => {
        if (err) {
            console.error(err);
            res.json({ message: err });
        }
        else {
            Structure.find(where)
                .populate({
                    path: 'pt',
                    //select: 'Id Sex', 
                    model: 'Patient'
                })
                .populate({
                    path: 'plansetup',
                    //select: 'Id', 
                    model: 'PlanSetup'
                })
                .populate({
                    path: 'sset',
                    //select: 'Id', 
                    model: 'StructureSet'
                })
                //.select("sset_list")
                .skip(skip)
                .limit(limit)
                .sort([[filter.SortBy, filter.SortIncrement ? 1 : -1]])
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


// get structures with filter, returns only structure ids
router.post('/filtered/ids', function (req, res, next) {

    filter = req.body

    console.log('----------- /filtered -------------')
    console.log('filter=', filter);

    // convert to where condision
    var where = filter2where(filter)

    console.log('find');
    console.log('where', where)

    Structure.find(where)
    .select('_id')
    // .skip(skip)
    // .limit(limit)
    .exec((err, data) => {
        if (err) {
            console.error(err);
            res.json({ message: err });
        }
        else {
            const ret = data;
            res.json(ret);
        }
    })
}); // post()


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
    Pt.find({ 'sset_list.s_list.ROINumber': 25 })
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



module.exports = router;