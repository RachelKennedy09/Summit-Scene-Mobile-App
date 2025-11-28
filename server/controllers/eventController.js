// server/controllers/eventController.js
// Controller functions for SummitScene events
// Handles CRUD operations for Event model

import Event from "../models/Event.js";

// GET /api/events
// Return upcoming events (today or later)
// Also populates createdBy (business host profile) for frontend
export async function getAllEvents(req, res) {
  try {
    // Build today's date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    // Only events on or after today
    const events = await Event.find({ date: { $gte: todayStr } })
      .sort({ date: 1 })
      .populate(
        "createdBy",
        "name email role avatarUrl town bio looking For instagram website"
      );

    return res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return res.status(500).json({
      message: "Error fetching events.",
      error: error.message,
    });
  }
}

// POST /api/events
// Create a new event: reads data from req.body, validates required fields,
// saves to MongoDB, and returns the saved event.
export async function createEvent(req, res) {
  try {
    const userId = req.user?.userId; // from auth middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no user ID." });
    }

    const {
      title,
      description,
      town,
      category,
      date,
      time,
      endTime,
      location,
      imageUrl,
    } = req.body || {};

    // Basic validation
    if (!title || !town || !category || !date) {
      return res.status(400).json({
        message: "title, town, category and date are required.",
      });
    }

    const event = new Event({
      title,
      description,
      town,
      category,
      date,
      time,
      endTime,
      location,
      imageUrl,
      createdBy: userId,
    });

    const savedEvent = await event.save();

    return res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error.message);
    return res.status(500).json({
      message: "Error creating event.",
      error: error.message,
    });
  }
}

// GET /api/events/:id
// Get a single event by its MongoDB ID
// Also populates createdBy with host profile info
export async function getEventById(req, res) {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate(
      "createdBy",
      "name email role avatarUrl town bio lookingFor instagram website"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    return res.json(event);
  } catch (error) {
    console.error("Error fetching single event:", error.message);
    return res.status(500).json({
      message: "Error fetching event.",
      error: error.message,
    });
  }
}

// PUT /api/events/:id
// Update an existing event (business + owner only)
export async function updateEvent(req, res) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    // Find the event
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check ownership
    if (!event.createdBy || event.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this event." });
    }

    // Only update allowed fields
    const {
      title,
      description,
      town,
      category,
      date,
      time,
      endTime,
      location,
      imageUrl,
    } = req.body || {};

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (town !== undefined) event.town = town;
    if (category !== undefined) event.category = category;
    if (date !== undefined) event.date = date;
    if (time !== undefined) event.time = time;
    if (endTime !== undefined) event.endTime = endTime;
    if (location !== undefined) event.location = location;
    if (imageUrl !== undefined) event.imageUrl = imageUrl;

    const updated = await event.save();

    return res.json(updated);
  } catch (error) {
    console.error("Error updating event:", error.message);
    return res.status(500).json({
      message: "Error updating event.",
      error: error.message,
    });
  }
}

// DELETE /api/events/:id
// Delete an event (business + owner only)
export async function deleteEvent(req, res) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    // Find the event
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check ownership
    if (!event.createdBy || event.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this event." });
    }

    await event.deleteOne();

    return res.json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    return res.status(500).json({
      message: "Error deleting event.",
      error: error.message,
    });
  }
}

// GET /api/events/mine
// Return only events created by the currently logged-in user
// Also populates createdBy, so the frontend still has host info
export async function getMyEvents(req, res) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no user ID." });
    }

    // Find events where createdBy matches this user
    const events = await Event.find({ createdBy: userId })
      .sort({ date: 1 })
      .populate(
        "createdBy",
        "name email role avatarUrl town bio lookingFor instagram website"
      );

    return res.json(events);
  } catch (error) {
    console.error("Error fetching my events:", error.message);
    return res.status(500).json({
      message: "Error fetching your events.",
      error: error.message,
    });
  }
}
