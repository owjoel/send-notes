const url = require('url');
const WebSocket = require("ws");
const {handleOrderRequest} = require("./orderSocket");

const wss = new WebSocket.Server({ noServer: true });

function configSocket(server) {
  server.on("upgrade", async (req, socket, head) => {
    try {
      const pathname = url.parse(req.url).pathname;
      const segments = pathname.split("/").filter((seg) => seg !== "");
      if (segments[2] === "orders" && segments[3] !== undefined) {
        wss.handleUpgrade(req, socket, head, (ws) => {
          console.log('orderID:', segments[3]);
          const orderId = segments[3]; // Extract order ID from the URL
          handleOrderRequest(ws, orderId); // Call the order handling function
        });
      } else {
        console.log("websocket closed");
        socket.destroy();
      }
    } catch (err) {
      console.log("websocket closed");
      socket.destroy();
    }
  });
}

wss.on("connection", (ws, req) => {
  console.log("socket created with client " + req.socket.remoteAddress);
  ws.on("message", (msg) => {
    console.log(msg.toString());
    ws.send(JSON.stringify({ status: 200, msg: "RECEIVED" }));
  });
});

module.exports = configSocket