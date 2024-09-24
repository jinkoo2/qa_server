"use strict";

var express = require('express');
var router = express.Router();
var emailer = require('../services/emailer');
var dailydigest = require('../services/dailydigest/dailydigest');

const authorizedOnly = require('../security/authorizedOnly');

// POST an email
router.post('/', authorizedOnly, function(req, res, next) {
  const mail = req.body;
  console.log("mail=", mail);
  emailer.send(mail);
  
  res.send('Job Done');

}); // post()

// POST - dailydigest
router.post('/dailydigest', authorizedOnly, function(req, res, next) {

  dailydigest();

  res.send('Job Done');

}); // post()


module.exports = router;
