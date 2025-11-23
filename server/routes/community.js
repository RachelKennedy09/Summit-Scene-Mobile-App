import express from "express";
import {
  getCommunityPosts,
  createCommunityPost,
} from "../controllers/communityController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// only logged in users with an account
router.get("/", authMiddleware, getCommunityPosts);

router.post("/", authMiddleware, createCommunityPost);

export default router;
