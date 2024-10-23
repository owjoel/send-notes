const amqp = require("amqplib");
const OrderService = require("../../../services/orderService")
const {publishOrderProcessing} = require("./producer");
let ch;
const notesFoundQ = 'notes-found';
const paymentCompletedQ = 'payment-completed';
// Load environment variables
// if (process.env.NODE_ENV === 'production') {
//   dotenv.config({ path: '.env.production' });
// } else {
//   dotenv.config({ path: '.env.development' });
// }
async function configConsumer() {
  try {
    const conn = await amqp.connect({
      protocol: process.env.RABBITMQ_PROTOCOL,
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD,
      hostname: process.env.RABBITMQ_HOST,
      port: process.env.RABBITMQ_PORT,
    });
    console.log(`CONSUMER Connected: ${process.env.RABBITMQ_HOST}`)
    ch = await conn.createChannel();
    ch.assertExchange('orders', 'topic');

    await ch.assertQueue(notesFoundQ);
    ch.bindQueue(notesFoundQ, 'orders', 'orders.notes.#');
    await ch.consume(notesFoundQ, handleNotesEvent);
  } catch (err) {
    console.log(err);
  }
}

const handleNotesEvent = (message) => {
  const routingKey = message.fields.routingKey;
  if (routingKey === 'orders.notes.found') {
    console.log('notes found event')
    handleEvent(message, notesFoundHandler);

  } else if (routingKey === 'orders.notes.missing') {
    console.log('notes missing event')
    handleEvent(message, notesMissingHandler);

  }
}

function handleEvent(message, fn) {
  console.log(message.content.toString())
  const data = JSON.parse(message.content.toString());
  fn(data);
  ch.ack(message);
}

async function notesFoundHandler(data) {
  console.log(data);
  await OrderService.updateOrderStatus(data._id, 'validated')
}
async function notesMissingHandler(data) {
  console.log(data);
  await OrderService.updateOrderStatus(data._id, 'cancelled')
}

// async function paymentStatusHandler(data) {
//   console.log(data);
// }

module.exports = { configConsumer };
