require('dotenv').config();  // Load environment variables
const Stripe = require('stripe');
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables');
}
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);  // Initialize Stripe with your secret key

module.exports = stripe;