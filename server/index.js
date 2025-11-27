// entry point for Summit Scene backend (API server) (boots the app)

import express from "express"; // Routing and Server logic
import cors from "cors"; // Expo/React Native can talk to this server
import { connectDB } from "./config/db.js"; // MongoDB helper
import eventRoutes from "./routes/events.js";
import authRouter from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import communityRoutes from "./routes/community.js";

// Create the Express app
const app = express();

//Global middleware
app.use(cors()); // Allow requests from Expo / web clients on other origins
app.use(express.json()); // Parse incoming JSON request bodies into req.body

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SummitScene API is healthy" });
});

// Auth and user routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);

// Community and Events routes
app.use("/api/community", communityRoutes);
app.use("/api/events", eventRoutes);

//simple root route
app.get("/", (req, res) => {
  res.json({ message: "SummitScene API is running" });
});

// Port configuration ( from env in production, 4000 by default in dev)
const PORT = process.env.PORT || 4000;

// Start function: connect to DB, then start server
async function startServer() {
  try {
    //connect to mongodb
    await connectDB();
    app.listen(PORT, () => {
      console.log(` SummitScene API listening on port ${PORT}`);
      if (process.env.NODE_ENV) {
        console.log(`Environment: ${process.env.NODE_ENV}`);
      }
    });
  } catch (error) {
    console.error(" Failed to start server:", error.message);
    // If DB connection fails, exit with non-zero code
    process.exit(1);
  }
}

// Call the startup process
startServer();

// export default app;
