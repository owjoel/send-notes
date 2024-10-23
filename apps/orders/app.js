require('dotenv').config();
const createError = require('http-errors');
const bodyParser = require("body-parser");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// App Dependencies
const healthRouter = require('./routes/health');
const orderRouter = require('./routes/order');
const stripeRouter = require('./routes/stripe')
const connectDB = require('./config/db');
const connectMQ = require('./config/events');

const app = express();

// view engine setup
connectMQ();
connectDB();


app.use(logger('dev'));

// Allow requests from your frontend URL
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,

}));
//body parse is for stripe webhook
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

app.use('/health', healthRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/stripe', stripeRouter);

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

// server.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });

module.exports = app;
