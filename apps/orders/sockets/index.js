const WebSocket = require('ws');
const {handleOrderRequest} = require('./orderSocket');
const url = require('url');

module.exports = (server) => {
    const wss = new WebSocket.Server({ noServer: true }); // Use noServer to avoid automatic upgrade

    server.on('upgrade', (request, socket, head) => {
        const pathname = url.parse(request.url).pathname;
        const segments = pathname.split('/').filter(seg => seg !== '');

        if (segments[0] === "orders" && segments[1] !== undefined) {
            wss.handleUpgrade(request, socket, head, (ws) => {
                console.log('New Order WebSocket connection');
                const orderId = segments[1]; // Extract order ID from the URL
                handleOrderRequest(ws, orderId); // Call the order handling function
            });
        } else {
            socket.destroy(); // Close the socket if it's not a valid WebSocket connection
        }
    });

    return wss;
};
