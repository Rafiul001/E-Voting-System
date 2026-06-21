import app from "./app";
import config from "./config/config";
import { connectToDatabase } from "./mongodb_connection/connection";
import { initiallyEnrollAdminAndConnectGateway } from "./networkConnection/networkConnection";

import { WebSocketServer, WebSocket } from "ws";

// ⭐ Extend WebSocket type to safely add clientId
interface ExtWebSocket extends WebSocket {
  clientId?: string;
}

// Store clients: clientId → socket
const clients = new Map<string, ExtWebSocket>();

// Create WebSocket server
const wss = new WebSocketServer({ port: 4000 }, () => {
  console.log("🚀 WebSocket running on ws://localhost:4000");
});

// Handle connections
wss.on("connection", (socket: WebSocket) => {
  const ws = socket as ExtWebSocket;

  console.log("🟢 Client connected");

  ws.on("message", (raw: string) => {
    const data = JSON.parse(raw);
    console.log("📩 Received:", data);

    // Step 1 — Registration
    if (data.type === "REGISTER") {
      ws.clientId = data.clientId;
      clients.set(data.clientId, ws);

      console.log(`🔗 Registered client: ${data.clientId}`);
      return;
    }

    // Step 2 — Direct Secure Messaging
    if (data.type === "SEND_TO") {
      const target = clients.get(data.targetId);

      if (!target) {
        console.log("❌ Target client not found:", data.targetId);
        return;
      }

      target.send(
        JSON.stringify({
          from: ws.clientId,
          message: data.message,
        })
      );

      console.log(`📤 Message delivered to ${data.targetId}`);
    }
  });

  // Cleanup when disconnected
  ws.on("close", () => {
    if (ws.clientId) {
      clients.delete(ws.clientId);
      console.log(`🔴 Client disconnected: ${ws.clientId}`);
    }
  });
});

// Start main Express backend
app.listen(config.port, async () => {
  await connectToDatabase();
  await initiallyEnrollAdminAndConnectGateway("admin", "adminpw");
  console.log(`🔥 Express API running: http://localhost:${config.port}`);
});
