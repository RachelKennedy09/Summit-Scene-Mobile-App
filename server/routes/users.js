// server/routes/users.js
// User-related routes (upgrade account)
// Let local users upgrade to a business account without creating a new one

import express from "express";
import authMiddleware from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/*
  PATCH /api/users/upgrade-to-business
  AUTH: required (must be logged in)

  FLOW:
  1) Read userId from JWT (authMiddleware attaches req.user)
  2) Find user in MongoDB
  3) If already business -> 400
  4) Set role = "business", save
  5) Return updated user (no passwordHash)
*/

router.patch("/upgrade-to-business", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "business") {
      return res
        .status(400)
        .json({ message: "Account is already a business account." });
    }

    user.role = "business";
    await user.save();

    return res.json({
      message: "Account upgraded to business.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error upgrading to business:", error.message);
    res
      .status(500)
      .json({ message: "Server error while upgrading account." });
  }
});

export default router;
