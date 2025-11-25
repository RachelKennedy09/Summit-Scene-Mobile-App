// server/models/CommunityPost.js
// Defines the CommunityPost collection structure in MongoDB

import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["highwayconditions", "rideshare", "eventbuddy"],
      required: true,
    },
    town: {
      type: String,
      enum: ["Banff", "Canmore", "Lake Louise"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    targetDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// This creates/uses the "communityposts" collection in MongoDB
const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);


export default CommunityPost;
