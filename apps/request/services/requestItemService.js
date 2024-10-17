const RequestItem = require("../models/RequestItem");
const {
  publishRequestNotify,
} = require("../adapters/events/rabbitmq/producer");

// Create new order

class RequestItemService {
  static async createRequest(user, requestData) {
    const regex = /^[a-zA-Z0-9 _-]+$/;

    // Only allow these characters ( alpha numbers _ - space )
    if (!regex.test(requestData.tag)) {
      throw new Error("validation error request tag");
    }

    try {
      const request = new RequestItem();
      request.userId = user;
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

  static async notifyRequest(tag) {
    await RequestItem.exists({ tag: tag }).catch((err) => {
      throw new Error("Tag not found");
    });

    try {
      const requestItems = await RequestItem.find({ tag: tag });

      let users = [];

      for (let i = 0; i < requestItems.length; i++) {
        users.push(requestItems[i].userId);
      }

      const result = { users, tag };

      publishRequestNotify(result);

      return result;
    } catch (error) {
      throw new Error("internal server error");
    }
  }
}

module.exports = RequestItemService;
