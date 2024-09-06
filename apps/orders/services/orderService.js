const Order = require('../models/Order');

// Create new order

class OrderService {
    static async createOrder(orderData) {
        try {
            const order = new Order(orderData);
            return await order.save();
        } catch (error) {
            throw new Error('Internal server error');
        }
    }

    static async findById(orderId) {
        try {
            return await Order.findById(orderId);
        } catch (error) {
            throw new Error('Internal server error');

        }
    }

    static async findAll() {
        try {
            return  await Order.find({});

        } catch (error) {
            throw new Error('Internal server error');

        }
    }

    static async update(orderId, updateData) {
        try {
            return await Order.findByIdAndUpdate(orderId, updateData, { new: true });

        } catch (error) {
            throw new Error('Internal server error');

        }
    }

    static async deleteOrderById(orderId) {
        try {
            return await Order.deleteOne({ id: orderId });

        } catch (error) {
            throw new Error('Internal server error');
        }
    }
}

module.exports = OrderService;