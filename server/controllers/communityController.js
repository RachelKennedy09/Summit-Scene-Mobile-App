// server/controllers/communityController.js
// Logic for handling community-related API requests

import CommunityPost from "../models/CommunityPost.js";

// GET /api/community?type=highwayconditions&town=Banff
export async function getCommunityPosts(req, res) {
  try {
    const { type, town } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (town) filter.town = town;

    const posts = await CommunityPost.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching community posts", error);
    res.status(500).json({ error: "Failed to load community posts" });
  }
}

// POST /api/community
export async function createCommunityPost(req, res) {
  try {
    // authMiddleware (from your README) sets: req.user.userId
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: missing user id" });
    }

    const { type, town, title, body, targetDate } = req.body;

    const newPost = await CommunityPost.create({
      user: userId,
      type,
      town,
      title,
      body,
      targetDate,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post", error);
    res.status(500).json({ error: "Failed to create post" });
  }
}
