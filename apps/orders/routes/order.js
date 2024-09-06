const express = require('express');
const axios = require('axios');
const router = express.Router();
const Order = require('../models/Order');

// Retrieve an order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
  

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const { orderId, stripeTransactionId, noteId, buyerEmail, orderStatus, orderPrice } = req.body;

  try {
    // Validate noteId
    const noteResponse = await axios.get(`${NOTE_SERVICE_URL}/${noteId}`);
    if (noteResponse.status !== 200) {
      return res.status(400).json({ message: 'Invalid note ID' });
    }

    // Validate buyerEmail
    const accountResponse = await axios.get(`${ACCOUNT_SERVICE_URL}?email=${buyerEmail}`);
    if (accountResponse.status !== 200) {
      return res.status(400).json({ message: 'Invalid account email' });
    }

    const order = new Order({
      orderId,
      stripeTransactionId,
      noteId,
      buyerEmail,
      orderStatus,
      orderPrice
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete order by ID
router.delete('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (order) {
      await order.remove();
      res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
