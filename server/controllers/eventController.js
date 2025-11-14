// Controller functions for SummitScene events
//imports the event model
// gets all events from mongo and returns json

import Event from "../models/Event.js";

//GET /api/events
// Return all events (later will filter by town, date, etc)
export async function getAllEvents(req, res) {
  try {
    // Find all events, sort by date (ascending)
    const events = await Event.find().sort({ date: 1 });

    res.json(events); //200 OK by default
  } catch (error) {
    console.error("Error fetchign events:", error.message);
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
}

// POST /api/events
// Create a new event , reads data from req.body, validates required fields, saves to MongoDB, and returns saved event.
export async function createEvent(req, res) {
  try {
    const {
      title,
      description,
      town,
      category,
      date,
      time,
      location,
      imageUrl,
    } = req.body;

    // Basic required field check
    if (!title || !town || !date) {
      return res.status(400).json({
        message: "title, town, and date are required",
      });
    }

    const event = new Event({
      title,
      description,
      town,
      category,
      date,
      time,
      location,
      imageUrl,
    });

    const savedEvent = await event.save();

    res.status(201).json(savedEvent); // 201 success created
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json;
    ({
      message: "Error creating event",
      error: error.message,
    });
  }
}

// GET /api/events/:id - Get one event
export async function getEventById(req, res) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching single event:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
}

// PUT /api/events/:id - update event

export async function updateEvent(req, res) {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated version
    );

    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating event:", error.message);
    res
      .status(500)
      .json({ message: "Error updating event", error: error.message });
  }
}

// DELETE /api/events/:id - Delete event
export async function deleteEvent(req, res) {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
}
