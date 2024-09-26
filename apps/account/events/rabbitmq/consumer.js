const amqp = require("amqplib");
const { retrieveUser } = require("../../services/user.service");
require('dotenv').config();

let ch;
const orderSuccessQ = 'order-success';

async function configMQ() {
  try {
    const username = process.env.RABBITMQ_USERNAME
    const password = process.env.RABBITMQ_PASSWORD
    const hostname = process.env.RABBITMQ_HOSTNAME
    const port = process.env.RABBITMQ_PORT
    const url = `amqp://${username}:${password}@${hostname}:${port}/`

    const conn = await amqp.connect(url);
    ch = await conn.createChannel();
    ch.assertExchange("orders", "topic");

    await ch.assertQueue(orderSuccessQ);
    ch.bindQueue(orderSuccessQ, 'orders', 'orders.success');
    ch.consume(orderSuccessQ, handleOrderScuess)

  } catch (err) {
    console.log(err);
  }
}

const handleOrderScuess = async (message) => {
  ch.ack(message);
  const data = JSON.parse(message.content.toString());
  console.log(data);
  try {
    const user = await retrieveUser(data.buyerId);
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}

module.exports = configMQ;
