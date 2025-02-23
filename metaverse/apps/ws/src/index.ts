import { WebSocketServer } from "ws";
import { User } from "./User";
import WebSocket from "ws";
import client from "@repo/db/client"; // Ensure this is imported

const PORT = 3001;

// Check database connection before starting WebSocket server
async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await client.$connect(); // Try connecting to DB
    console.log("✅ Database connection successful.");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Check if WebSocket server is already running
async function checkExistingWebSocketServer(): Promise<boolean> {
  return new Promise((resolve) => {
    const testClient = new WebSocket(`ws://localhost:${PORT}`);

    testClient.on("open", () => {
      console.log(
        "⚠️  WebSocket server is already running. No need to start another instance."
      );
      testClient.close();
      resolve(true);
    });

    testClient.on("error", () => resolve(false));

    testClient.on("close", () => resolve(false));

    setTimeout(() => {
      testClient.terminate();
      resolve(false);
    }, 2000);
  });
}

async function startWebSocketServer() {
  const isDBConnected = await checkDatabaseConnection();
  if (!isDBConnected) {
    console.error(
      "❌ Exiting: WebSocket server cannot start without a database connection."
    );
    process.exit(1); // Exit process if DB connection fails
  }

  const isAlreadyRunning = await checkExistingWebSocketServer();
  if (isAlreadyRunning) return;

  const wss = new WebSocketServer({ port: PORT });
  console.log(`🚀 WebSocket server is running on ws://localhost:${PORT}`);

  wss.on("connection", function connection(ws) {
    console.log("User connected");
    let user = new User(ws);
    ws.on("error", console.error);

    ws.on("close", () => {
      console.log("User disconnected");
      user?.destroy();
    });
  });
}

startWebSocketServer();
