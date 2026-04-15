import dotenv from "dotenv";
import { startServer, stopServer } from "./server.js";
import { connectToDB, disconnectFromDB } from "./db.js";

dotenv.config();

async function startApp() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("FATAL: JWT_SECRET environment variable is required");
    }

    await connectToDB();
    await startServer();
  } catch (error) {
    console.error("Error starting application:", error);
    process.exit(1);
  }
}

async function stopApp() {
  try {
    await stopServer();
    await disconnectFromDB();
  } catch (error) {
    console.error("Error stopping application:", error);
  }
}

startApp();
