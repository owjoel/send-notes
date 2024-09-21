const {
  EventBridgeClient,
  PutEventsCommand,
  EventBridge,
} = require("@aws-sdk/client-eventbridge");

const {
  SQS,
  ReceiveMessageCommand,
  SQSClient,
} = require("@aws-sdk/client-sqs");

const sqs = new SQS();
const eb_client = new EventBridgeClient({});

const sqs_client = new SQSClient({});
const SQS_QUEUE_URL =
  "https://sqs.us-east-1.amazonaws.com/211125709264/OrderCreatedQueue";

const pollMessage = async (queueUrl) => {
  try {
    const res = sqs_client.send(
      new ReceiveMessageCommand({
        AttributeNames: ["SentTimestamp"],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ["All"],
        QueueUrl: queueUrl,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 20,
      })
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

async function publishOrderCreatedEvent(data) {
  const res = await eb_client.send(
    new PutEventsCommand({
      Entries: [
        {
          EventBusName: "only-notes-v1",
          Detail: JSON.stringify(data),
          DetailType: "OrderCreated",
          Source: "only-notes.orders",
        },
      ],
    })
  );
  console.log("Response: " + JSON.stringify(res.$metadata));
  return res.$metadata.httpStatusCode == 200;
}

async function AWSClient() {
  
}

module.exports = { AWSClient, publishOrderCreatedEvent };