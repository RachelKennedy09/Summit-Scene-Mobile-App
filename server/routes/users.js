// server/routes/users.js
// User-related routes (upgrade account & profile updates)

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
        // include profile fields so frontend stays in sync:

        avatarKey: user.avatarKey,
        town: user.town,
        bio: user.bio,
        lookingFor: user.lookingFor,
        instagram: user.instagram,
        website: user.website,
      },
    });
  } catch (error) {
    console.error("Error upgrading to business:", error.message);
    res.status(500).json({ message: "Server error while upgrading account." });
  }
});

// PATCH /api/users/me
// Update logged-in user's profile fields (name, avatar, town, bio, etc.)
router.patch("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log("🔥 LIVE USERS /me v2 handler hit. Body:", req.body);

    const { name, town, bio, lookingFor, instagram, website, avatarKey } =
      req.body || {};

    const updates = {};

    if (typeof name === "string") updates.name = name.trim();
    if (typeof town === "string") updates.town = town.trim();
    if (typeof bio === "string") updates.bio = bio.trim();
    if (typeof lookingFor === "string") updates.lookingFor = lookingFor.trim();
    if (typeof instagram === "string") updates.instagram = instagram.trim();
    if (typeof website === "string") updates.website = website.trim();

    // ✅ always respect avatarKey when it is present in the body
    if (Object.prototype.hasOwnProperty.call(req.body || {}, "avatarKey")) {
      if (avatarKey === null) {
        updates.avatarKey = null;
      } else if (typeof avatarKey === "string") {
        updates.avatarKey = avatarKey.trim();
      }
    }

    console.log("PATCH /api/users/me updates:", updates);

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      message: "Profile updated.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarKey: user.avatarKey,
        town: user.town,
        bio: user.bio,
        lookingFor: user.lookingFor,
        instagram: user.instagram,
        website: user.website,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Failed to update profile." });
  }
});

export default router;
