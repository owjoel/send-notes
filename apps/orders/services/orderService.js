const Order = require('../models/Order');
const stripe = require('../config/stripeConfig');  // Import the configured Stripe instance

// Create new order
class OrderService {
    /**
     * Sample flow of creating orders
     * Frontend (Customer add items to cart, clicks pay)
     * --> FE sends order details (price, noteId, buyerEmail..?)
     * (Validation check, we should find noteId to get price, and match)
     *
     * Backend (Create paymentIntent to stripe API, specific fields as needed)
     * Backend will return client_secret to payment intent in frontend
     *
     * Frontend(Confirms payment, using client_secret to submit payment intent)
     * Webhook listens to this, calls a function updateStripePaymentId in Order service, updates the order data in the table via paymentIntentId
     *
     */

    /**
     * Sample order data that is submitted from the frontend
     * {
     *     "noteId": "noteId_1",
     *     "buyerEmail": "samplebuyer@gmail.com",
     *     "orderPrice": 50000
     * }
     *
     * order status, stripetransactionId, orderId, will be filled after paymentIntent creation
     */
    static async createOrder(orderData) {
        try {
            
            const paymentIntent = await stripe.paymentIntents.create({
                amount : orderData.orderPrice,
                currency: 'sgd',
                customer:orderData.customerId,
                payment_method_types: ['card']
            });

            const data = {
                ...orderData,
                orderId: paymentIntent.id,
                stripeTransactionId: paymentIntent.id,
                orderStatus:"Processing"
            }
            const order = new Order(data);
            return await order.save();
            
        } catch (error) {
            console.log(error);
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
    static async confirm(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status === 'succeeded') {
                const order = new Order({
                    customerId: paymentIntent.customer,
                    amount,
                    status: 'paid',
                    stripePaymentIntentId: paymentIntentId
                });

                await order.save();
            }
        } catch (error) {
            throw new Error('Internal Server Error')
        }
    }

    static async update(orderId, updateData) {
        try {
            return await Order.findByIdAndUpdate(orderId, updateData, { new: true });

        } catch (error) {
            throw new Error('Internal server error');
        }
    }

    // Note that this function is only used for stripe webhook
    static async updateStripePaymentIntent(paymentIntentId ) {
        try {
            const updatedOrder= await Order.findOneAndUpdate(
                { stripeTransactionId: paymentIntentId },
                { $set: { orderStatus: 'Successful' } },
                { new: true }
            );
            console.log(updatedOrder);
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