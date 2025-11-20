//mongoose model for app users
//stores login info in MongoDB (email, password hash, name, timestamps etc)

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    //unique email for each user
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    //hashed password, NOT plain text
    passwordHash: {
      type: String,
      required: true,
    },
    // display name for Account screen
    name: {
      type: String,
      trim: true,
    },
    // role for permissions ("local" vs "business")
    role: {
      type: String,
      enum: ["local", "business"], //locks to only local or business
      default: "local", // if not provided, treat as local user
      required: true,
    },
  },
  {
    // Adds created/At /updatedAt automatically
    timestamps: true,
  }
);

// create the "users" collection in <MmongoDB
const User = mongoose.model("User", userSchema);

export default User;
