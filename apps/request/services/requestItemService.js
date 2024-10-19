const RequestItem = require("../models/RequestItem");
const {
  publishRequestNotify,
} = require("../adapters/events/rabbitmq/producer");
const AWS = require('aws-sdk');

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const notifyQueueUrl = process.env["NOTIFY_SQS"];

AWS.config.update({ region: process.env["AWS_REGION"] });

class RequestItemService {
  static async createRequest(user, requestData, email) {
    const regex = /^[a-zA-Z0-9 _-]+$/;

    // Only allow these characters ( alpha numbers _ - space )
    if (!regex.test(requestData.tag)) {
      throw new Error("validation error request tag");
    }

    try {
      const request = new RequestItem();
      request.userId = user;
      request.email = email;
      request.tag = requestData.tag;

      await request.save();
      return request;
    } catch (error) {
      console.log(error);
      throw new Error("internal server error");
    }
  }

  static async findById(requestId) {
    try {
      // const exists = await RequestItem.exists({ _id: requestId })
      return await RequestItem.findById(requestId);
    } catch (error) {
      throw new Error("internal server error");
    }
  }

  static async findByUserId(userId) {
    await RequestItem.exists({ userId: userId }).catch((err) => {
      throw new Error("user not found");
    });

    try {
      return await RequestItem.find({ userId: userId });
    } catch (error) {
      throw new Error("internal server error");
    }
  }

  static async findAll() {
    try {
      return await RequestItem.find({});
    } catch (error) {
      throw new Error("Internal server error");
    }
  }

  static async update(user, requestId, requestData) {
    try {
      return await RequestItem.findByIdAndUpdate(requestId, requestData, {
        new: true,
      });
    } catch (error) {
      throw new Error("Internal server error");
    }
  }

  static async delete(requestId) {
    try {
      return await RequestItem.findByIdAndDelete(requestId);
    } catch (error) {
      throw new Error("Internal server error");
    }
  }


  static async notifyRequest(tag, noteId) {

    noteId = "test-note-id";

    await RequestItem.exists({ tag: tag }).catch((err) => {
      throw new Error("Tag not found");
    });

    try {
      const requestItems = await RequestItem.find({ tag: tag });


      for (let i = 0; i < requestItems.length; i++) {
        await RequestItemService.notifyToQueue(requestItems[i].email, tag, noteId)
      }



      return;
    } catch (error) {
      throw new Error("internal server error");
    }
  }

  static async notifyToQueue(email, tag, noteId){

    const messageBody = {
      sellerEmail: email,
      tag: tag,
      note_id: noteId
    };

    const params = {
      MessageBody: JSON.stringify(messageBody),
      QueueUrl: notifyQueueUrl,
    };

    console.log(params)



    try {
      const data = await sqs.sendMessage(params).promise();
      console.log('Message sent successfully:', data.MessageId);
      return true;
    } catch (err) {
      console.error('Error sending message to SQS:', err);
      return false;
    }
  }


}

module.exports = RequestItemService;







