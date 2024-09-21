const { configConsumer } = require("../adapters/events/rabbitmq/consumer");
const { configProducer } = require("../adapters/events/rabbitmq/producer")

const connectMQ = () => {
    configProducer();
    configConsumer();
}

module.exports = connectMQ;