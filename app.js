var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
var dotenv = require('dotenv/config');

var indexRouter = require('./routes/index');
var ptsRouter = require('./routes/pts');
var structuresRouter = require('./routes/structures');
var structureDateSetsRouter = require('./routes/structuredatasets');
var trainingJobsRouter = require('./routes/trainingjobs');

var app = express();


app.use(cors()); // Enable CORS for all routes

// app.use((req, res, next) => {
//   // console.log('app.js: req.headers', req.headers)
//   // console.log('app.js: req.headers.orgin', req.headers.origin)

//   //fs.writeFileSync('req.json', JSON.stringify(req));

//   //console.log('req.header=', req.header)

//   //
//   // Dynamically setting Access-Control-Allow-Origin. This is basically allowing all incoming request
//   // this can be used to limit the access. 
//   // By not setting * always is to allow the requesters to have the cridential in the request
//   // 
//   if (req.headers.origin) {
//     console.log('setting req.headers.origin for cors')
//     res.append('Access-Control-Allow-Origin', req.headers.origin);
//   }

//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
//   res.append('Access-Control-Allow-Credentials', 'true');
//   res.append('Access-Control-Allow-Headers', 'Content-Type,*');
//   next();
// });

//const db_server = process.env.DB_SERVER;
const db_server = "mongodb://172.200.0.2"
const db_name = "planlist";
const public_dir = path.join(__dirname, "public")
//const public_dir = "/home/jk/g_drive/c_drive"

console.log('DB_SERVER===>', db_server);
console.log('DB_NAME===>', db_name);

mongoose.connect(`${db_server}/${db_name}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(data => {
    console.log('db connection successful!.')
  })
  .catch(err => {
    console.log(err);
    process.exit();
  });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));
console.log('public_dir=', public_dir)
app.use(express.static(public_dir));

app.use('/', indexRouter);
app.use('/pts', ptsRouter);
app.use('/api/structuredatasets', structureDateSetsRouter)
app.use('/api/structures', structuresRouter)
app.use('/api/trainingjobs', trainingJobsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// websocket handler - onconnect method is hooked in the file 'www'
var websocket_handler = require('./websocket_handler')
app.websocket_handler = new websocket_handler()
module.exports = app;







