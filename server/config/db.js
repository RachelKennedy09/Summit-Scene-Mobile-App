/// Hanles connecting to MongoDB using Mongoose (ESM style)

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); //loads .env file so process.env.MONGODB.URI works

export async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB (SummitScene)");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
}
