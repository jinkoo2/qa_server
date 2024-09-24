var express = require('express');
var router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const path = require('path');
const appLogger = require('../security/appLogger')

const authorizedOnly = require('../security/authorizedOnly');

const secret = fs.readFileSync( path.join(__dirname, '../security/token.key'));
//const secret = 'shhh'

function add_user_to_db_with_encryption(user, req){
  // hash passwrod

  const user_in_db = new User(user);
  user_in_db.save()
    .then(data =>{
      console.log('a user has been added', data);
      appLogger.log("a new user added", 'a new user added', req)
    })
    .catch(err => {
      console.error('error adding a user case...', err);
      appLogger.error('user add failed', 'user add failed', req)
    });
}

function is_validate_email(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

function update_user_pw_in_db_with_encryption(userid, password, req){
  
  (new User()).hashPassword(password,(err, hashedPassword)=>{
    if(err)
      console.error('hashing failed=>', err)

    User.updateOne({userid:userid},{
        $set: {password:hashedPassword}
    })
    .then(data=>{
        appLogger.log("user password updated", `user passowrd updated(${userid})`, req)
    })
    .catch(err => {
        console.error(err);

        appLogger.error("user password update failed", `user password update failed(${userid})`, req)
    });      
  })
}

function ad_findUser(userid, password){
  return new Promise(function(resolve,reject){

    var ActiveDirectory = require('activedirectory');
    var ADconfig = require('../config').AD;

    var config ={
      url: ADconfig.url,
      baseDN: ADconfig.baseDN,
      username: `UHMC\\${userid}`,
      password: password
    };
    var ad = new ActiveDirectory(config);

    // instread of useing authenticate function, findUser function is used to check both the autentication & getting email.
    // in the future, it's better to send an email to make sure that the right user is accessing the data. 
    // email activation (1. first time login, 2. not using it for a long time?, or, like regularly monthly or quertaly etc.)
    ad.findUser(userid, function (err, user) {
      
      // technically this error should happend when the system has issue
      // but we are using the user account to run the query (not using a service account)
      // when the user id or the password is incorrect, this error occurs.
      // so, instead of rejecting, we are resolving as login error
      if(err)
      {
        console.log("findUser failed")
        resolve({success: false, error:err, msg:"findUser failed"});
        return;
      }

      if(user){
        //////////////
        // there is a user account in the domain controller, 
        // and the password is correct
        console.log('success!')
        console.log('user=', user)
        //const payload = { userid };

        resolve({success: true, user: user})
        return;
      } 
      else{
        // which code area will be reached when a seperate service user account was used
        // and the findUser did not returned an error.
        // But, the no user found. This does not mean the passwrod was checked.
        console.log("user not found")
        resolve({success: false, error:null, msg: "user not found"})
        return;
      }
    }); // findUesr
  }) // Promise
} // function ad_findUser

function ad_login(userid, password, res, req, callback_on_success=null){
  ad_findUser(userid, password)
  .then(result=>{
    if(result.success){
      
      const user_from_ad = result.user;
      
      //console.log('user_from_ad==>', user_from_ad);

      const user_info = { 
        userid: userid, 
        name: user_from_ad.displayName, 
        email: user_from_ad.mail,
      };

      // call callback on sucess if defined
      if(callback_on_success)
        callback_on_success(user_from_ad);

      //const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      const token = jwt.sign(user_info, secret);
      
      // set the JWT in the cookie. Using cookie, it is difficult to del with crose domain.
      // so, at the same time, send the token as response.
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax'  })
          .status(200)
          .json({...user_info, token: token})

      appLogger.log("login success", `login success(${userid})`, req)
    }
    else 
    {
      console.log('authentication failed!')
      appLogger.log("login failed", `login failed(${userid})`, req)
      res.status(401);
      res.end()
    }
  })
}

// function test_del_user(){
//   User.remove({userid:'jkim20'})
//   .then(data=>console.log(data))
//   .catch(err=>console.error(err))
// }

// function test_ch_pw(){
//   User.updateOne({userid:'jkim20'},{
//     $set: {password:'NOT VALID PASSWORD'}
//   })
//   .then(data=>console.log(data))
//   .catch(err=>console.error(err))
// }

///////////////////////////////////////////
// authentication algorithm
// 1. try login against the DB
// 2. if no user found, try login against AD, if successful, create a user in DB.
// 3. if user found, but the password is not correct, try login agaist AD, if successful, update the passwrod in DB
// with this implementation, mojority of logins will be handled based on DB. So, users can be authenticated either via DB or AD.

router.post('/authenticate', function(req, res, next) {

  // test_del_user();
  // return;

  // test_ch_pw();
  // return;

  const { userid, password } = req.body;

  res.append('Access-Control-Allow-Credentials', 'true');

  // check if this user exist
  User.findOne({userid:userid})
  .then(user_from_db=>{

    // console.log('user_from_db', user_from_db)

    if(!user_from_db)
      {
        console.log('user not found')

        // login against AD
        // if success, create a user in db
        ad_login(userid, password, res, req, (user_from_ad)=>{
          
          console.log('adding the user to db')     

          const settings = {
            notify_planq_list: false,
            planq_num_of_cases_per_page: 10,
            qalist_num_of_cases_per_page: 10,
            notify_qa_new: false,
            notify_qa_completed_all: false,
            notify_aria_rx_change: false,
            notify_aria_plan_change: false,
            notify_aria_structure_change:false,
            notify_for_all_patients:false,
            planner: false,
            doctor: false,
            aria_userid: ""
            //my_machines: (enumList)?enumList.machine_list.join(','):'' 
          }

          add_user_to_db_with_encryption({
            userid: userid,
            name: user_from_ad.displayName,
            email: user_from_ad.mail, 
            password: password,
            settings: settings }, req)
        
          }); // ad_login
      }   
      else // if(!user_from_db)
      {
        // console.log('user_from_db',user_from_db)

        // is active?
        if(!user_from_db.active){
          console.log('Not active user!')
          appLogger.error("login not allowed", `login not allow. Not active user(${userid})`, req)
          res.status(401);
          res.end()
          return;
        }

        // check if the passwrod is correct
        user_from_db.isCorrectPassword(password,(err,same)=>
        {
          if(err) 
          {
              console.error("Internal Error:password compare failed")
          }
          
          if(same) // password matched!
          {
             const user_info=
             {
               userid: userid,
               email: user_from_db.email,
               name: user_from_db.name,
               settings: user_from_db.settings
             }

            //const token = jwt.sign(payload, secret, { expiresIn: '1h' });
            const token = jwt.sign(user_info, secret);
        
            // set the JWT in the cookie. Using cookie, it is difficult to del with crose domain.
            // so, at the same time, send the token as response.
            res.cookie('token', token, { httpOnly: true, sameSite: 'lax'  })
              .status(200)
              .json({...user_info, token: token})

            appLogger.log("login success", `login success(${userid})`, req)

            // check if the email address is in the correct format
            if(!is_validate_email(user_from_db.email))
            {
              appLogger.error("Error: Invalid email address", JSON.stringify(user_info))
            }
          }
          else // if same
          {
            // incorrect password, try against AD, if successful, update the password
            ad_login(userid, password, res, req, (user_from_ad)=>{
              console.log('updating user password in DB')
              update_user_pw_in_db_with_encryption(userid, password, req)
            });
          } //if same
        }) // isCorrectPassword
      } //if(!user_from_db)
  })
  .catch(err=>{ 
    console.error(err) 
  }) //User.findOne({userid:userid})
  
}) //post


/* GET ALL USERS */
router.get('/',  function(req, res, next) {
  
  //console.log('get');
  User.find()
  .then(data=>{
      //console.log(data);

      appLogger.log("returning users", "returning users", req)

      res.json(data);
  })
  .catch(err => {
      console.error(err);

      appLogger.error("User.find() failed", "User.find() failed", req)

      res.json({message: err});
  });
});


/* GET A USER*/
router.get('/userid/:userid', authorizedOnly, function(req, res, next) {
  
  const userid = req.params.userid;
  //console.log(planId);
  
  User.findOne({userid:userid})
  .then(data=>{
      
      appLogger.log("returning a user", `returning a user(${userid})`, req)

      res.json(data);
  })
  .catch(err => {
      console.error(err);
      
      appLogger.error("returning a user failed", `returning a user failed(${userid})`, req)

      res.json({message: err});
  });
});

/* GET A USER SETTINGS*/
router.get('/userid/:userid/settings', function(req, res, next) {
  
  const userid = req.params.userid;
  //console.log(planId);
  
  User.findOne({userid:userid}, 'settings')
  .then(data=>{
      
      appLogger.log("returning a user settings", `returning a user settings(${userid})`, req)

      res.json(data);
  })
  .catch(err => {
      console.error(err);
      
      appLogger.error("returning a user settings failed", `returning a user settings failed(${userid})`, req)

      res.json({message: err});
  });
});

/* SET A USER SETTINGS
/* UPDATE A USER */
router.patch('/userid/:userid/settings', authorizedOnly, function(req, res, next) {
  
  const userid = req.params.userid;
  
  User.updateOne({userid:userid},{
      $set: {settings:req.body} 
  })
  .then(data=>{
      
      // console.log(data);
      appLogger.log("user settings updated", `user settings updated(${userid})`, req)

      res.json(data);
  })
  .catch(err => {
      console.error(err);

      appLogger.error("user update failed", `user update failed(${userid})`, req)

      res.json({message: err});
  });
});


/* UPDATE A USER */
router.patch('/userid/:userid', authorizedOnly, function(req, res, next) {
  
  const userid = req.params.userid;
  
  User.updateOne({userid:userid},{
      $set: req.body
  })
  .then(data=>{
      
      // console.log(data);
      appLogger.log("user updated", `user updated(${userid})`, req)

      res.json(data);
  })
  .catch(err => {
      console.error(err);

      appLogger.error("user update failed", `user update failed(${userid})`, req)

      res.json({message: err});
  });
});


module.exports = router;
