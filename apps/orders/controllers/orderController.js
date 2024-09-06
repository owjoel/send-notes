const orderService = require('../services/orderService');

// Retrieve order by ID
async function getOrderById(req, res) {
  try {
    const order = await orderService.findOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create new order
async function createOrder(req, res) {
  const { orderId, stripeTransactionId, noteId, buyerEmail, orderStatus, orderPrice } = req.body;

  try {
    // Validate noteId
    // TO FILL UP NXT TIME

    // Validate buyerEmail
    // ALSO FOR NEXT TIME
    const order = await orderService.createOrder({
      orderId,
      stripeTransactionId,
      noteId,
      buyerEmail,
      orderStatus,
      orderPrice
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Retrieve all orders
async function getAllOrders(req, res) {
  try {
      const orders = await orderService.findAllOrders();
      res.status(200).json(orders);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

// Update order by ID
async function updateOrderById(req, res) {
  const {orderId} = req.params;
  const updateData = req.body;

  try {
    const updatedOrder = await orderService.updateOrderById(orderId, updateData);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully', updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Delete an order by ID
async function deleteOrderById(req, res) {
  try {
    const result = await orderService.deleteOrderById(req.params.orderId);
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getOrderById,
  createOrder,
  getAllOrders,
  updateOrderById,
  deleteOrderById
};