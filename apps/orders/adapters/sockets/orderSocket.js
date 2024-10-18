const OrderService = require('../../services/orderService'); // Assume you have a service to get order data

const handleOrderRequest = (ws, orderId) => {
    const fetchOrder = async () => {
        const interval = 2000; // 2 seconds
        const maxAttempts = 5;
        let attempts = 0;
        const polling = setInterval(async () => {
            try {
                const orderData = await OrderService.findById(orderId);
                console.log('orderData is', orderData);

                if (orderData.orderStatus === 'validated') {
                    const client_secret = await OrderService.createPaymentIntent(orderId);
                    console.log('client secret is ', client_secret);
                    ws.send(JSON.stringify(client_secret));
                    clearInterval(polling);
                    ws.close();
                } else {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        console.log("Max polling attempts reached. Closing connection.");
                        ws.send(JSON.stringify({error: 'Order not validated after multiple attempts'}));
                        clearInterval(polling); // Clear the polling interval
                        ws.close(); // Close the connection
                    }
                }
            } catch (err) {
                ws.send(JSON.stringify({error: 'Failed to fetch order data'}));
                clearInterval(polling); // Clear the polling interval
                ws.close(); // Close the connection after sending the error message
            }
        }, interval);
    };
    fetchOrder();
}

module.exports = {
    handleOrderRequest
};