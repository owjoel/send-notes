require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var healthRouter = require('./routes/health')
var requestItemRoute = require('./routes/requestItem')
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
var app = express();

// view engine setup

connectDB();

app.use(
    bodyParser.json({
      verify: function(req, res, buf) {
        req.rawBody = buf;
      }
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//body parse is for stripe webhook
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/request', requestItemRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(500).json({
    message: err.message,
    error: err
  });
});

module.exports = app;
