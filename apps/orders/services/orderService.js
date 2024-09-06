const Order = require('../models/Order');

// Create new order
async function createOrder(orderData) {
  const order = new Order(orderData);
  return await order.save();
}

// Retrieve order by ID
async function findOrderById(orderId) {
  return await Order.findById(orderId);
}

// Retrieve all orders
async function findAllOrders() {
    return await Order.find({});
}

// Update order by ID
async function updateOrderById(orderId, updateData) {
    return await Order.findByIdAndUpdate(orderId, updateData, { new: true });
}

// Delete order by ID
async function deleteOrderById(orderId) {
  return await Order.deleteOne({ _id: orderId });
}

module.exports = {
    createOrder,
    findOrderById,
    findAllOrders,
    updateOrderById,
    deleteOrderById
  };