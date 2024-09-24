require('dotenv').config();
// External Dependencies
const http = require('http')
const url = require('url');
const createError = require('http-errors');
const bodyParser = require("body-parser");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const WebSocket = require('ws');
const cors = require('cors');

// App Dependencies
const healthRouter = require('./routes/health');
const orderRouter = require('./routes/order');
const stripeRouter = require('./routes/stripe')
const connectDB = require('./config/db');
const connectMQ = require('./config/events');
const { findById } = require('./services/orderService');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });


// view engine setup
connectMQ();
connectDB();


server.on('upgrade', (req, socket, head) => {
  const pathname = url.parse(req.url).pathname;
  const segments = pathname.split('/').filter(seg => seg !== '');
  const order = findById(segments[1]);
  if (segments[0] === "orders" && order) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    })
  } else {
    console.log('websocket closed');
    socket.destroy();
  }
})

wss.on('connection', (ws, req) => {
  console.log('socket created with client ' + req.socket.remoteAddress);
  ws.on('message', (msg) => {
    console.log(msg.toString());
    ws.send(JSON.stringify({"status": 200, "msg": "RECEIVED"}));
  })
})

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

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

module.exports = app;
