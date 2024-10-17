const OrderService = require('../services/orderService');

// Retrieve order by ID
async function getOrderById(req, res) {
  try {
    const order = await OrderService.findById(req.params.orderId);
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
  // const { orderId, stripeTransactionId, noteId, buyerEmail, orderStatus, orderPrice } = req.body;
  console.log(req.body);
  try {
    const order = await OrderService.createOrder(req.body);
    res.status(201).json({ message: 'Order created successfully', ...order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Retrieve all orders
async function getAllOrders(req, res) {
  try {
      const orders = await OrderService.findAll();
      res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Update order by ID
async function updateOrderById(req, res) {
  const {orderId} = req.params;
  const updateData = req.body;

  try {
    const updatedOrder = await OrderService.update(orderId, updateData);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order updated successfully', updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
async function deleteOrderById(req, res) {
  try {
    const result = await OrderService.deleteOrderById(req.params.orderId);

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getOrderByAccId(req, res) {
  try {
    const result = await OrderService.getOrdersByAccId(req.params.id);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }  else {
      res.status(200).json(result);
    }

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getOrderById,
  createOrder,
  getAllOrders,
  updateOrderById,
  deleteOrderById,
  getOrderByAccId
};