const express = require('express');
const stripeController = require("../controllers/stripeController");
const router = express.Router();





router.post('/webhook', stripeController.stripeWebhook);


module.exports = router;