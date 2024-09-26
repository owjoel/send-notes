const Order = require('../models/Order');
const stripe = require('../config/stripeConfig');
const {publishOrderCreated, publishOrderProcessing} = require("../adapters/events/rabbitmq/producer");  // Import the configured Stripe instance

// Create new order
class OrderService {
    static async createOrder(orderData) {
        try {
            const data = {
                ...orderData,
                orderStatus:"created"
            }
            const order = new Order(data);
            await order.save();
            publishOrderCreated(order._id, order)
            return {
                order_id: order._id,
                client_secret: paymentIntent.client_secret,
            };
            
        } catch (error) {
            console.log(error);
            throw new Error('Internal server error');
        }
    }

    static async createPaymentIntent(orderData){
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount : orderData.orderPrice,
                currency: 'sgd',
                customer:orderData.customerId,
                payment_method_types: ['card'],
                metadata: {
                    orderId: orderData._id
                }
            });
            await Order.findOneAndUpdate(
                { _id: orderData._id },
                { $set: { orderStatus: `processing` } },
                { new: true }
            );

            return paymentIntent.client_secret;
        } catch(error) {
            throw error;
        }
    }
    // static async updateStripeId(stripeId) {
    //     try {
    //         const updatedOrder= await Order.findOneAndUpdate(
    //             { _id: orderId },
    //             { $set: { orderStatus: `${status}` } },
    //             { new: true }
    //         );
    //     } catch (error) {
    //         throw error;
    //     }
    // }
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
            // if (status === 'processing') {
            //     publishOrderProcessing(data._id, data);
            // }
            console.log('updated order', updatedOrder);
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