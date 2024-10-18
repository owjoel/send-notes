const Order = require('../models/Order');
const stripe = require('../config/stripeConfig');
const {publishOrderCreated} = require("../adapters/events/rabbitmq/producer");  // Import the configured Stripe instance

// Create new order
class OrderService {
    static async createOrder(orderData) {
        try {
            const data = {
                ...orderData,
                orderStatus:"created"
            }
            const order = await new Order(data);
            await order.save();
            publishOrderCreated(order._id, order)
            return {
                status:200,
                orderId: order.id
            };
            
        } catch (error) {
            console.log(error);
            throw new Error('Internal server error');
        }
    }

    static async createPaymentIntent(orderId){
        try {
            const orderData = await Order.findById(orderId);
            const paymentIntent = await stripe.paymentIntents.create({
                amount : orderData.orderPrice,
                currency: 'sgd',
                customer:orderData.customerId,
                payment_method_types: ['card'],
                metadata: {
                    orderId: `${orderData._id}`
                }
            });
            await Order.findOneAndUpdate(
                { _id: orderData._id },
                { $set: {
                    orderStatus: `processing`,
                    paymentIntentId: paymentIntent.id
                } },
                { new: true }
            );
            return paymentIntent.client_secret;
        } catch(error) {
            throw error;
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
    static async updateOrderStatus(orderId, status) {
        try {
            const updatedOrder= await Order.findOneAndUpdate(
                { _id: orderId },
                { $set: { orderStatus: `${status}` } },
                { new: true }
            );
            return {
                status:200,
                data: updatedOrder
            };

        } catch (error) {
            throw new Error('Internal server error'); // Ensure this matches your test expectation
        }
    }
    static async deleteOrderById(orderId) {
        try {
            return await Order.deleteOne({ id: orderId });

        } catch (error) {
            throw new Error('Internal server error');
        }
    }

    static async getOrdersByAccId(accId) {
        try {
            return await Order.find({ buyerId: accId });
        } catch {
            throw new Error('Internal server error');
        }
    }
}

module.exports = OrderService;