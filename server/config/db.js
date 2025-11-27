// Handles connecting to MongoDB using Mongoose (ESM style)

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // loads .env file so process.env.MONGODB_URI works

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    // Attempt connection
    const conn = await mongoose.connect(uri);

    // Success log
    console.log(
      `Connected to MongoDB: ${conn.connection.name} (cluster: ${conn.connection.host})`
    );

    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error; // rethrow so server.js knows to stop startup
  }
}
