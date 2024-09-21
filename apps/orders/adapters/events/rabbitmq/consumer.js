const amqp = require("amqplib");

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
  handleEvent(message, test);
}

const handlePaymentEvent = (message) => {
  handleEvent(message, test);
}

function handleEvent(message, fn) {
  const data = JSON.parse(message.content.toString());
  fn(data);
  ch.ack(message);
}

function test(data) {
  console.log(data);
}

module.exports = { configConsumer };
