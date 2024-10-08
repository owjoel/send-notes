const amqp = require("amqplib");

let ch;

async function configProducer() {
  try {
    const conn = await amqp.connect();
    ch = await conn.createChannel();
    await ch.assertExchange('orders', 'topic');
  } catch (err) {
    console.log(err);
  }
}

function publish(id, event, data) {
  try {
    const rk = "orders." + event;
    ch.publish('orders', rk, Buffer.from(JSON.stringify(data)));
    console.log("Published %s event for transaction id: %s", event, id);
    return true;
  } catch (err) {
    console.log(err);
  }
  return false;
}

function publishOrderCreated(id, data) {
  console.log('published orderCreated event', data)
  return publish(id, "created", data);
}


// not used yet, for logging purposes
// function publishOrderProcessing(id, data) {
//   return publish(id, "processing", data);
// }

module.exports = { configProducer, publishOrderCreated };
