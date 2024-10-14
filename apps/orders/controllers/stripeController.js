const StripeService = require('../services/stripeWebhookService')
const OrderService = require('../services/orderService')
const { publishOrderSuccessful } = require('../adapters/events/rabbitmq/producer')

async function stripeWebhook  (req, res){
    try {
        const event=await StripeService.paymentIntentListener(req);

        if (event.type === 'payment_intent.created') {
            const paymentIntent = event.data.object;
            console.log('PaymentIntent created:');

        } else if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            console.log('PaymentIntent succeeded:', paymentIntent);
            await OrderService.updateOrderStatus(paymentIntent.metadata._id, 'successful');
            order = await OrderService.findById(paymentIntent.metadata._id)
            publishOrderSuccessful(paymentIntent.metadata._id, order)

        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            await OrderService.updateOrderStatus(paymentIntent.metadata._id, 'failed');
            console.log('PaymentIntent failed:', paymentIntent);
        }
        res.json({ received: true });
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
}

module.exports = {
    stripeWebhook
};
