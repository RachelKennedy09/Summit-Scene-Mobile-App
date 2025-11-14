// entry point for Summit Scene backend (API server)

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

// create the express app
const app = express();

//Global middleware
app.use(cors()); // allow requests from expo app
app.use(express.json()); //allow JSON in request bodies

//simple test route
app.get("/", (req, res) => {
  res.json({
    message: "summitScene API is running (ESM)",
  });
});

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
