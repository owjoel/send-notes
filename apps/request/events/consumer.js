const { notifyRequest } = require("../services/requestItemService");


const notesFoundQ = "notes-found";
const paymentCompletedQ = "payment-completed";

async function connnectAMQP() {
  try {
    const conn = await amqp.connect({
      protocol: process.env.RABBITMQ_PROTOCOL,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
      hostname: process.env.RABBITMQ_HOST,
      port: process.env.RABBITMQ_PORT,
    });
    console.log(`CONSUMER Connected: ${process.env.RABBITMQ_HOST}`);
    ch = await conn.createChannel();
    ch.assertExchange("orders", "topic");

    await ch.assertQueue(notesFoundQ);
    ch.bindQueue(notesFoundQ, "orders", "orders.notes.#");
    await ch.consume(notesFoundQ, handleListingEvent);
  } catch (err) {
    console.log(err);
  }
}

// EDDY HELP THANKS HAHA
const handleListingEvent = async (message) => {
  const listing = JSON.parse(message.content.toString()); // of type ListingStatus, see models
  const res = await notifyRequest(listing);
};

module.exports = { connnectAMQP };
