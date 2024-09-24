const OrderService = require('../services/orderService'); // Assume you have a service to get order data

const handleOrderRequest = (ws, orderId) => {
    const fetchOrder = async () => {
        try {
            const orderData = await OrderService.findById(orderId);
            // Send order data after a 10-second delay
            setTimeout(() => {
                ws.send(JSON.stringify(orderData)); // Sends order data
                ws.close(); // Close the connection after sending the data
            }, 10000);
        } catch (err) {
            // Send an error message if fetching order data fails
            ws.send(JSON.stringify({ error: 'Failed to fetch order data' }));
            ws.close(); // Close the connection after sending the error message
        }
    };

    fetchOrder();
};

module.exports = {
    handleOrderRequest
};