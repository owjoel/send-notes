const url = require('url');
const WebSocket = require("ws");
const { findById } = require('../../services/orderService');

const wss = new WebSocket.Server({ noServer: true });

function configSocket(server) {
  server.on("upgrade", async (req, socket, head) => {
    try {
      const pathname = url.parse(req.url).pathname;
      const segments = pathname.split("/").filter((seg) => seg !== "");
      const order = await findById(segments[1]);
  
      if (segments[0] === "orders" && order) {
        wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit("connection", ws, req);
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