const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/user/:id', orderController.getOrderByAccId);
router.get('/:orderId', orderController.getOrderById);
router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.put('/:orderId', orderController.updateOrderById);
router.delete('/:orderId', orderController.deleteOrderById);

module.exports = router;
