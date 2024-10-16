const amqp = require("amqplib");
const requestItemService = require("../../../services/requestItemService")
let ch;
const notesVerifiedQ = 'notes-verified';

async function configConsumer() {
  try {
    const conn = await amqp.connect();
    ch = await conn.createChannel();
    ch.assertExchange('requests', 'topic');

    await ch.assertQueue(notesVerifiedQ);
    ch.bindQueue(notesVerifiedQ, 'requests', 'notes.verified');
    ch.consume(notesVerifiedQ, handleNotesVerified);

  } catch (err) {
    console.log(err);
  }
}

const handleNotesVerified = (message) => {
  handleEvent(message, notesVerifiedHandler);
}


function handleEvent(message, fn) {
  const data = JSON.parse(message.content.toString());
  fn(data);
  ch.ack(message);
}

async function notesVerifiedHandler(data) {
  console.log(data);
  const tag = data.tag
  await requestItemService.notifyRequest(tag)
}


module.exports = { configConsumer };
