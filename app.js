var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

var indexRouter = require('./routes/index');
var catphanResultRouter = require('./routes/catphanresult');

// Initialize express app
var app = express();

// Enable CORS for all routes
app.use(cors());

// Database connection setup
const db_server = process.env.DB_SERVER || "mongodb://172.100.0.2";
const db_name = process.env.DB_NAME || "qa_server";
console.log('DB_SERVER===>', db_server);
console.log('DB_NAME===>', db_name);

mongoose.connect(`${db_server}/${db_name}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('db connection successful!.');
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit on connection failure
  });

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static file serving
const public_dir = path.join(__dirname, 'public');
console.log('public_dir=', public_dir);
app.use(express.static(public_dir));

// Route setup
app.use('/', indexRouter);  // Uncomment if indexRouter is required
app.use('/api/catphanresults', catphanResultRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Websocket handler
var websocket_handler = require('./websocket_handler');
app.websocket_handler = new websocket_handler();

module.exports = app;
