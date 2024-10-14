const express = require('express');
const { stripeWebhook } = require("../controllers/stripeController");
const router = express.Router();





router.post('/webhook', stripeWebhook);


module.exports = router;