var express = require('express');
var router = express.Router();
const authorizedOnly = require('../security/authorizedOnly');
var appLogger = require('../security/appLogger')

const DAYS = ['SUN','MON','TUE','WED', 'THR', 'FRI','SAT'];
function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  } 
function YYYY_MM_DD(date){
    var yyyy = date.getFullYear();
    var mm = zeroPad(date.getMonth()+1,2);
    var dd  = zeroPad(date.getDate(), 2);
    var strTime = `${yyyy}-${mm}-${dd}`;
    return strTime;
  }

function MM_DD_DAY(date){
    var mm =zeroPad(date.getMonth()+1,2);
    var dd  = zeroPad(date.getDate(),2);
    var dow = DAYS[date.getDay()];

    var strTime = `${mm}/${dd} [${dow}]`;
    return strTime;
  }

router.get('/', authorizedOnly, function(req, res, next) {
  
    /////////////////////////////////
    // Model
    var Plan = require('../models/plan');

    //////////////////////////////////////
    // time now
    const t0 = (new Date()).toISOString();
    console.log("Now=",t0);

    var options = { newstart: {$gt: t0}}

    Plan.find(options)
    .then(data=>{
        // sort by newstart date
        data.sort((pi1, pi2)=>{
        return((new Date(pi1.newstart) > new Date(pi2.newstart))?(1):(-1));
        })

        let planlist = data.map(plan => {
            return { 
                newstart_str: MM_DD_DAY(new Date(plan.newstart)), 
                plan:plan 
            };
        })
        
        appLogger("planlist", "returning planlist to "+ req.userid, req);

        // render
        res.render('planlist', { 
        title: 'PlanQ',
            planlist: planlist});
    })
    .catch(err => {
        console.log('err');
        res.json({message: err});
    });

});

module.exports = router;
