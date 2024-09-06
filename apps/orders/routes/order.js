const express = require('express');
const axios = require('axios');
const router = express.Router();
const Order = require('../models/Order');

// Retrieve order by ID
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

// Create new order
router.post('/', async (req, res) => {
  const { orderId, stripeTransactionId, noteId, buyerEmail, orderStatus, orderPrice } = req.body;

  try {
    // Validate noteId
    // Mock noteResponse as if the Note service validation was successful
    const noteResponse = { status: 200 }; // Fake successful response

    // Mock accountResponse as if the Account service validation was successful
    const accountResponse = { status: 200 }; // Fake successful response

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
