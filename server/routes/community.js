// server/routes/community.js
// Routes for the Community tab (highway conditions, rideshares, event buddies)

import express from "express";
import {
  getCommunityPosts,
  createCommunityPost,
  deleteCommunityPost,
  updateCommunityPost,
  addCommunityReply, 
  toggleLike,
} from "../controllers/communityController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// All community routes require a logged-in user
// (JWT is validated in authMiddleware and user is attached to req.user)

// GET /api/community
// Fetch community posts, optionally filtered by ?type=&town=
router.get("/", authMiddleware, getCommunityPosts);

// POST /api/community
// Create a new community post (uses req.user as the author)
router.post("/", authMiddleware, createCommunityPost);

// DELETE /api/community/:id
// Delete a community post by ID (controller should ensure only the owner can delete)
router.delete("/:id", authMiddleware, deleteCommunityPost);

// PUT /api/community/:id
// Update a community post by ID
router.put("/:id", authMiddleware, updateCommunityPost);

// POST /api/community/:postId/replies
// Add a reply under a community post
router.post("/:postId/replies", authMiddleware, addCommunityReply);


// toggle like on a post
router.post("/:id/likes", authMiddleware, toggleLike);

export default router;
