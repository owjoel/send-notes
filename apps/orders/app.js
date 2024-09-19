require('dotenv').config();
// External Dependencies
var createError = require('http-errors');
const bodyParser = require("body-parser");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// App Dependencies
const healthRouter = require('./routes/health');
const orderRouter = require('./routes/order');
const stripeRouter = require('./routes/stripe')
const connectDB = require('./config/db');
const {  }

var app = express();

// view engine setup

connectDB();


app.use(logger('dev'));
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
app.use('/health', healthRouter);
app.use('/orders', orderRouter);
app.use('/stripe', stripeRouter);

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
