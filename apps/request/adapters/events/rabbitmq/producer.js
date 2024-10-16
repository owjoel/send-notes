const amqp = require("amqplib");

let ch;

async function configProducer() {
  try {
    const conn = await amqp.connect();
    ch = await conn.createChannel();
    await ch.assertExchange('requests', 'topic');
  } catch (err) {
    console.log(err);
  }
}

function publish(event, data) {
  try {
    const rk = "requests." + event;
    ch.publish('requests', rk, Buffer.from(JSON.stringify(data)));
    // console.log("Published %s event for request id: %s", event);
    return true;
  } catch (err) {
    console.log(err);
  }
  return false;
}

function publishRequestNotify(data) {
  console.log('published requestNotify event', data)
  return publish("notify", data);
}


module.exports = { configProducer, publishRequestNotify };
