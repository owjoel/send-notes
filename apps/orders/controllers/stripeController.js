const StripeService = require('../services/stripeWebhookService')
const OrderService = require('../services/orderService')

async function stripeWebhook  (req, res){
    try {
        const event=await StripeService.paymentIntentListener(req);

        if (event.type === 'payment_intent.created') {
            const paymentIntent = event.data.object;
            console.log('PaymentIntent created:');

        } else if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            console.log('PaymentIntent succeeded:', paymentIntent);
            await OrderService.updateOrderStatus(paymentIntent.id, 'successful');

        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            await OrderService.updateOrderStatus(paymentIntent.id, 'failed');
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
