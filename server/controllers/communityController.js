// server/controllers/communityController.js
// Logic for handling community-related API requests

import CommunityPost from "../models/CommunityPost.js";

// GET /api/community?type=highwayconditions&town=Banff
export async function getCommunityPosts(req, res) {
  try {
    const { type, town } = req.query;

    const filter = {};

    // Optional filters
    if (type) filter.type = type;
    if (town) filter.town = town;

    const posts = await CommunityPost.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.json(posts);
  } catch (error) {
    console.error("Error fetching community posts:", error.message);
    return res.status(500).json({
      message: "Failed to load community posts.",
      error: error.message,
    });
  }
}

// POST /api/community
// Create a new community post
export async function createCommunityPost(req, res) {
  try {
    // authMiddleware sets: req.user.userId, req.user.name, req.user.email
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: missing user ID." });
    }

    const { type, town, title, body, targetDate } = req.body || {};

    // Basic validation (no "name" here anymore)
    if (!type || !town || !title || !body || !targetDate) {
      return res.status(400).json({
        message:
          "Type, town, title, body, and date are required for community posts.",
      });
    }

    // Snapshot the display name from the account
    const displayName =
      req.user?.name || req.user?.email || "SummitScene member";

    const newPost = await CommunityPost.create({
      user: userId,
      type,
      town,
      title,
      body,
      name: displayName, 
      targetDate,
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating community post:", error.message);
    return res.status(500).json({
      message: "Failed to create community post.",
      error: error.message,
    });
  }
}

// DELETE /api/community/:id
export async function deleteCommunityPost(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Only owner can delete
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You cannot delete this post." });
    }

    await CommunityPost.findByIdAndDelete(postId);

    return res.json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting community post:", error.message);
    return res.status(500).json({
      message: "Failed to delete community post.",
      error: error.message,
    });
  }
}

// PUT /api/community/:id
// Update a community post (title, body, targetDate only)
export async function updateCommunityPost(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized." });
    }

    // Find the post first
    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Only the owner can edit
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You cannot edit this post." });
    }

    // Pull the fields we allow to be edited
    const { title, body, targetDate } = req.body || {};

    // title, body, and date are required for updates
    if (!title || !body || !targetDate) {
      return res.status(400).json({
        message: "Title, body, and date are required to update a post.",
      });
    }

    // Update only these fields
    post.title = title;
    post.body = body;
    post.targetDate = targetDate;

    const updated = await post.save();

    return res.json(updated);
  } catch (error) {
    console.error("Error updating community post:", error.message);
    return res.status(500).json({
      message: "Failed to update community post.",
      error: error.message,
    });
  }
}

// POST /api/community/:postId/replies
// Add a reply to a community post
export async function addCommunityReply(req, res) {
  try {
    const { postId } = req.params;
    const { body } = req.body || {};

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized." });
    }

    if (!body || !body.trim()) {
      return res
        .status(400)
        .json({ message: "Reply text (body) is required." });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const replyName = req.user?.name || req.user?.email || "SummitScene member";

    post.replies.push({
      user: userId,
      name: replyName,
      body: body.trim(),
    });

    await post.save();

    // Optionally populate user again for returning
    const populated = await post.populate("user", "name email role");

    return res.status(201).json({
      message: "Reply added successfully.",
      post: populated,
    });
  } catch (error) {
    console.error("Error adding community reply:", error.message);
    return res.status(500).json({
      message: "Failed to add reply.",
      error: error.message,
    });
  }
}
