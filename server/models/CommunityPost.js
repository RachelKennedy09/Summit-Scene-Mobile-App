// server/models/CommunityPost.js
// Defines the CommunityPost collection structure in MongoDB
// Used for the Community tab (highway conditions, rideshares, event buddies)

import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
  {
    // Reference to the user who created the post
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Post type controls which community section it appears in
    // - "highwayconditions" -> road reports, delays, snow, etc.
    // - "rideshare"         -> looking for/hosting rides
    // - "eventbuddy"        -> looking for people to go to events with
    type: {
      type: String,
      enum: ["highwayconditions", "rideshare", "eventbuddy"],
      required: true,
    },

    // Mountain town this post is about
    town: {
      type: String,
      enum: ["Banff", "Canmore", "Lake Louise"],
      required: true,
    },

    // Display name shown in the UI (can match account name or be custom)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Short headline shown in the Community list
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Full text body of the post
    body: {
      type: String,
      required: true,
      trim: true,
    },

    // The date this post is about (e.g., travel date, event date)
    // Stored as a real Date object
    targetDate: {
      type: Date,
      required: true,
    },
  },
  {
    // Automatically adds createdAt / updatedAt
    timestamps: true,

    // Include virtuals when sending to client
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Simple virtual for debugging / logging
communityPostSchema.virtual("summary").get(function () {
  return `${
    this.type
  } in ${this.town} on ${this.targetDate?.toISOString().slice(0, 10)}`;
});

// This creates/uses the "communityposts" collection in MongoDB
const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);

export default CommunityPost;
