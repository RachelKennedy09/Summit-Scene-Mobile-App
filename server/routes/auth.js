// Register and Login
// WHAT: Auth routes for Summit Scene
// WHY: Let clients create accounts and receive JWT tokens for secure requests

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

import authMiddleware from "../middleware/auth.js";

//load environment variables
dotenv.config();

const router = express.Router();

// Helper to create a JWT token
function createToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }

  // handle older users that might not have a role yet
  const role = user.role || "local";

  return jwt.sign({ userId: user._id.toString(), role }, secret, {
    expiresIn: "1h",
  });
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
    const { email, password, name, role } = req.body || {};

    // 1) validate
    // 2) check if email already exists
    // 3) hash the password
    // 4) save user to Mongo
    // 5) create a token
    // 6) return token + user info

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

    // Decide finalRole safely
    const allowedRoles = ["local", "business"];
    let finalRole = "local";

    if (role && allowedRoles.includes(role)) {
      finalRole = role;
    }

    // if something weird is send, fall back to "local"

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      name,
      role: finalRole,
    });

    // Create token
    const token = createToken(user);

    // Send minimal info back (not passwordHash)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
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

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || "local",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// GET /api/auth/me
// return the curent logged in users info
// restore sessions from a stored token

router.get("/me", authMiddleware, async (req, res) => {
  try {
    // auth middleware puts { userID } on req.user
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-passwordHash -__v"); //exclude passwordHash and version field

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // send user in same shape as register/login for consistancy
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || "local",
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error in /auth/me:", error);
    res.status(500).json({ message: "Server error while fetching user." });
  }
});



export default router;
