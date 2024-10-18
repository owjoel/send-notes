const StripeService = require('../services/stripeWebhookService')
const OrderService = require('../services/orderService')
const { publishOrderSuccessful } = require('../adapters/events/rabbitmq/producer')

async function stripeWebhook  (req, res){
    try {
        const event=await StripeService.paymentIntentListener(req);

        if (event.type === 'payment_intent.created') {
            const paymentIntent = event.data.object;
            console.log('PaymentIntent created:', event.data.object);


        } else if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            console.log('PaymentIntent succeeded:', paymentIntent);
            await OrderService.updateOrderStatus(paymentIntent.metadata.orderId, 'successful');
            console.log('ORDER ID' , paymentIntent.metadata.orderId)

            order = await OrderService.findById(paymentIntent.metadata.orderId);
            publishOrderSuccessful(paymentIntent.metadata.orderId, order)

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
