// Mongoose model for application users
// Stores login credentials (email, passwordHash, role) and basic profile info

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Unique email for each user
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    // Hashed password (stored securely — never plain text)
    passwordHash: {
      type: String,
      required: true,
    },

    // Display name shown in the Account screen
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Role defines permissions: "local" users or "business" owners
    role: {
      type: String,
      enum: ["local", "business"],
      default: "local",
      required: true,
    },

    //  Profile Fields
    avatarUrl: {
      type: String, // URL-based avatars
    },
    town: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    bio: {
      type: String,
      maxlength: 300, // keep it short + friendly
    },
    lookingFor: {
      type: String,
      maxlength: 200, // “looking for hiking buddies, markets, open mics…”
    },
    instagram: {
      type: String, // e.g. "@rachel_in_the_rockies"
    },
    website: {
      type: String, // Business only for their business website
    },
  },
  {
    // Automatically creates createdAt / updatedAt
    timestamps: true,

    // Include virtuals when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//  shows email without sensitive info
userSchema.virtual("safeProfile").get(function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
  };
});

// Create the "users" collection in MongoDB
const User = mongoose.model("User", userSchema);

export default User;
