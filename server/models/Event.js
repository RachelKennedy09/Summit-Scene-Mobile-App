// Event model for SummitScene evens (Banff, Canmore, Lake Louise, etc.)

import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, //every event needs a title
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    town: {
      type: String, // Banff, Canmore, Lake Louise
      required: true,
      trim: true,
    },
    category: {
      type: String, // Live music, Market, Family
      trim: true,
    },
    date: {
      type: String, // or date type maybe
      required: true,
    },
    time: {
      type: String, // "7:00 PM"
    },
    location: {
      type: String, // "High Rollers Banff"
      trim: true,
    },
    imageUrl: {
      type: String, //optional poster image URL
      trim: true,
    },
  },
  {
    timestamps: true, // adds CreateAt and updatedat automatically
  }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
