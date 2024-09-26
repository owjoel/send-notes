const amqp = require("amqplib");
const sns = require("../aws/sns");
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
  try {
    const data = JSON.parse(message.content.toString());
    console.log(data);
    const buyer = await retrieveUser(data.buyerId);
    const seller = await retrieveUser(data.sellerId);
    
    const payload = {
      orderID: data._id,
      bucket: data.bucket,
      file_key: data.file_key,
      notes: data.notes,
      buyerEmail: buyer.email,
      buyerName: buyer.username,
      sellerEmail: seller.email,
      sellerName: seller.username,
      price: data.orderPrice,
    }
    const ok = await sns.publish(JSON.stringify(payload))
    if (!ok) {
      console.log('Error publishing message!');
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = configMQ;
