const amqp = require("amqplib");

let ch;
const orderSuccessQ = 'order-success';

async function configMQ() {
  try {
    const conn = await amqp.connect();
    ch = await conn.createChannel();
    ch.assertExchange("orders", "topic");

    await ch.assertQueue(orderSuccessQ);
    ch.bindQueue(orderSuccessQ, 'orders', 'orders.success');
    ch.consume(orderSuccessQ, )

  } catch (err) {
    console.log(err);
  }
}

const handleOrderScuess = (message) => {
  const data = JSON.parse(message.content.toString());
  
  ch.ack(message);
}

module.exports = configMQ();
