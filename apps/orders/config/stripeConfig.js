require('dotenv').config();  // Load environment variables



const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);  // Initialize Stripe with your secret key

module.exports = stripe;