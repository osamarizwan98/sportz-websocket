import { WebSocketServer, WebSocket } from "ws";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }
  socket.send(JSON.stringify(payload));
}

function broadcastToAll(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== Websoket.OPEN) {
      continue;
    }

    client.send(JSON.stringify(payload));
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    noServer: true,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  server.on("upgrade", async (req, socket, head) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (pathname !== "/ws") {
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", async (socket, req) => {
    socket.isAlive = true;
    socket.on("pong", () => {
      socket.isAlive = true;
    });

    sendJson(socket, { type: "Welcome" });

    socket.on("message", (data) => {});

    socket.on("error", () => {
      socket.terminate();
    });

    socket.on("close", () => {});
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => clearInterval(interval));

  function broadcastMatchCreated(match) {
    broadcastToAll(wss, { type: "match_created", data: match });
  }
  return { broadcastMatchCreated };
}
