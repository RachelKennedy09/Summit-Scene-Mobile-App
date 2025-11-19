// entry point for Summit Scene backend (API server)

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import eventRoutes from "./routes/events.js";
import authRouter from "./routes/auth.js";

// create the express app
const app = express();

//Global middleware
app.use(cors()); // allow requests from expo app
app.use(express.json()); //allow JSON in request bodies

// auth routes
app.use("/api/auth", authRouter);

//simple test route
app.get("/", (req, res) => {
  res.json({
    message: "summitScene API is running (ESM)",
  });
});

// events routes for anything starting with /api/events
app.use("/api/events", eventRoutes);

// port for the backend
const PORT = process.env.PORT || 4000;

//start function that connects to DB THEN starts server
async function startServer() {
  //connect to mongodb
  await connectDB();

  //only start the server if DB connection worked
  app.listen(PORT, () => {
    console.log(`SummitScene API listening on port ${PORT}`);
  });
}
//call the start function
startServer();
