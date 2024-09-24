
const stripe = require('../config/stripeConfig');  // Import the configured Stripe instance
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

class StripeService {
    static async paymentIntentListener (req) {
        const sig = req.headers['stripe-signature'];
        try {
            return await stripe.webhooks.constructEvent(req.rawBody, sig, WEBHOOK_SECRET);
        } catch (err) {
            console.error(`Webhook signature verification failed.`, err.message);
            throw new Error('Internal Server Error')
        }
    }
}


module.exports = StripeService