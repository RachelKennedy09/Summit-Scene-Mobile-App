// Register and Login
// WHAT: Auth routes for Summit Scene
// WHY: Let clients create accounts and receive JWT tokens for secure requests

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

// Load environment variables (if not already loaded in index.js)
dotenv.config();

const router = express.Router();

// Helper to create a JWT token
function createToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }

  return jwt.sign({ userId }, secret, { expiresIn: "24h" });
}

/*
  POST /api/auth/register
  BODY: { email, password, name? }

  FLOW:
  1) Validate required fields
  2) Check if user already exists
  3) Hash password
  4) Save user
  5) Return token + minimal user info
*/
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body || {};

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      name,
    });

    // Create token
    const token = createToken(user._id.toString());

    // Send minimal info back (not passwordHash)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

/*
  POST /api/auth/login
  BODY: { email, password }

  FLOW:
  1) Validate required fields
  2) Find user by email
  3) Compare passwords
  4) Return token + user if valid
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user._id.toString());

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

export default router;
