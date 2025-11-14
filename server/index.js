// entry point for Summit Scene backend (API server)

import express from "express";
import cors from "cors";

// create the express app
const app = express();

//Global middleware
app.use(cors()); // allow requests from expo app
app.use(express.json()); //allow JSOn in request bodies

//simple test route
app.get("/", (req, res) => {
  res.json({
    message: "summitScene API is running (ESM)",
  });
});

// port for the backend
const PORT = process.env.PORT || 4000;

// start the server
app.listen(PORT, () => {
  console.log(`SummitScene API (ESM) listening on port ${PORT}`);
});
