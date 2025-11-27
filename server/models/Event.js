// Event model for SummitScene events (Banff, Canmore, Lake Louise, etc.)

import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    // Short title for the event card
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },

    // Longer description shown on the EventDetail screen
    description: {
      type: String,
      trim: true,
    },

    // Which mountain town this event belongs to
    town: {
      type: String,
      required: [true, "Town is required"],
      trim: true,
      enum: ["Banff", "Canmore", "Lake Louise"],
    },

    // Category for filtering (chips on Hub/Map screens)
    category: {
      type: String,
      trim: true,
      enum: [
        "Music",
        "Food & Drink",
        "Retail",
        "Outdoors",
        "Family",
        "Markets",
        "Other",
      ],
      default: "Other",
    },

    // Event date in YYYY-MM-DD format (string on purpose to avoid timezone issues)
    date: {
      type: String,
      required: [true, "Event date is required"],
      // Basic format check for YYYY-MM-DD
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in format YYYY-MM-DD"],
    },

    // Optional time string shown on cards/details, e.g. "7:00 PM"
    time: {
      type: String,
      trim: true,
    },
    // Optional end time string, e.g. "9:00 PM"
    endTime: {
      type: String,
      trim: true,
    },

    // Venue or meeting location, e.g. "High Rollers Banff"
    location: {
      type: String,
      trim: true,
    },

    // Optional poster image URL (used for hero image on EventDetail)
    imageUrl: {
      type: String,
      trim: true,
    },

    // Which user created this event (business owner)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // Automatically adds createdAt / updatedAt
    timestamps: true,

    // Include virtual fields when converting to JSON / objects
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//  quick label for debugging / logs
eventSchema.virtual("summary").get(function () {
  return `${this.title} (${this.town}) on ${this.date}`;
});

// Create the "events" collection in MongoDB
const Event = mongoose.model("Event", eventSchema);

export default Event;
