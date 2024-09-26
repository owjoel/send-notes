const OrderService = require('../../services/orderService'); // Assume you have a service to get order data

const handleOrderRequest = (ws, orderId) => {
    const fetchOrder = async () => {
        try {
            // Send order data after a 10-second delay

            setTimeout(async () => {
                const orderData = await OrderService.findById(orderId);
                if (orderData.status === 'validated') {
                    const client_secret = await OrderService.createPaymentIntent(orderId);
                    ws.send(JSON.stringify(client_secret)); // Sends order data
                }
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