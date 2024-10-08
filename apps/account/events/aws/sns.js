const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const client = new SNSClient({ region: "ap-southeast-1" });
const topic = process.env.AWS_SNS_TOPIC;
console.log(topic)

async function publish(data) {
  try {
    const res = await client.send(
      new PublishCommand({
        Message: data,
        TopicArn: topic,
      })
    );
    console.log(res)
    return res.$metadata.httpStatusCode == 200;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { publish }