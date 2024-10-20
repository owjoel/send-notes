const { notifyRequest } = require("../../../services/requestItemService");
const amqp = require("amqplib");

const notesFoundQ = "notes-found";
const paymentCompletedQ = "payment-completed";

let ch;
const orderSuccessQ = 'requests-notify';

async function configMQ() {
  const conn = await amqp.connect({
    protocol: process.env.RABBITMQ_PROTOCOL,
    username: process.env.RABBITMQ_USERNAME,
    password: process.env.RABBITMQ_PASSWORD,
    hostname: process.env.RABBITMQ_HOST,
    port: process.env.RABBITMQ_PORT,
  });
  console.log(`CONSUMER Connected: ${process.env.RABBITMQ_HOST}`);

  ch = await conn.createChannel();
  ch.assertExchange("listings", "topic");


  await ch.assertQueue(orderSuccessQ);
  ch.bindQueue(orderSuccessQ, 'listings', 'listings.completed');
  ch.consume(orderSuccessQ, handleListingCompleted)

  } catch (err) {
    console.log(err);
  }
}

const handleListingCompleted = async (message) => {
  console.log("HANDLING LISTING")
  ch.ack(message);
  try {
    const data = JSON.parse(message.content.toString());
    console.log(data);
    const seller = await notifyRequest(data.categoryCode,data._id);

    if (!ok) {
      console.log('Error publishing message!');
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = configMQ;
