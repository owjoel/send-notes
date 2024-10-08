const amqp = require("amqplib");
const OrderService = require("../../../services/orderService")
const {publishOrderProcessing} = require("./producer");
let ch;
const notesFoundQ = 'notes-found';
const paymentCompletedQ = 'payment-completed';

async function configConsumer() {
  try {
    const conn = await amqp.connect();
    ch = await conn.createChannel();
    ch.assertExchange('orders', 'topic');

    await ch.assertQueue(notesFoundQ);
    ch.bindQueue(notesFoundQ, 'orders', 'orders.notes.#');
    ch.consume(notesFoundQ, handleNotesFoundEvent);

    await ch.assertQueue(paymentCompletedQ);
    ch.bindQueue(paymentCompletedQ, 'orders', 'orders.payment.#');
    ch.consume(paymentCompletedQ, handlePaymentEvent);

  } catch (err) {
    console.log(err);
  }
}

const handleNotesFoundEvent = (message) => {
  handleEvent(message, notesFoundHandler);
}

const handlePaymentEvent = (message) => {
  handleEvent(message, test);
}

function handleEvent(message, fn) {
  const data = JSON.parse(message.content.toString());
  fn(data);
  ch.ack(message);
}

async function notesFoundHandler(data) {
  console.log(data);
  await OrderService.updateOrderStatus(data._id, 'validated')
}

async function paymentStatusHandler(data) {
  console.log(data);
}

module.exports = { configConsumer };
