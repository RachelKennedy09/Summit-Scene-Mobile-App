// Register and Login
// Lets clients create accounts and receive JWT tokens for secure requeets

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

//Helper to create a JWT token
function createToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in env variables");
  }
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: "24h" } // good for 24 hours then has to log in;
  );
}

/*
 POST /api/auth/register
 BODY: { email, password, name? }
 FLOW:
 1) Check if user already exists
 2) Hash password
 3) Save user
 4) Return token + minimal user info
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email is aleady registered." });
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

    //Send minimal info back (not passwordHash)
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
 1) Find user by email
 2) Compare passwords
 3) Return token + user if valid
 */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password. " });
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
    res.status(500).json({ message: "server error during login." });
  }
});

export default router;
