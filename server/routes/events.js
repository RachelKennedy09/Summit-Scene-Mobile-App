// server/routes/events.js
// Routes for /api/events
// Small mini app for event endpoints (Hub, Map, My Events, Post Event screens)

import express from "express";
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
} from "../controllers/eventController.js";
import authMiddleware from "../middleware/auth.js";
import isBusiness from "../middleware/isBusiness.js";

const router = express.Router();

// PUBLIC ROUTES
// GET /api/events
// Anyone can see all events (used by Hub and Map screens)
router.get("/", getAllEvents);

// GET /api/events/:id
// Anyone can see detailed info for a single event
router.get("/:id", getEventById);

// PROTECTED ROUTES

// GET /api/events/mine
// Logged-in users can see events they created (typically business accounts)
router.get("/mine", authMiddleware, getMyEvents);

// POST /api/events
// Only logged-in "business" role users can create events
router.post("/", authMiddleware, isBusiness, createEvent);

// PUT /api/events/:id
// Only the creator (business) can update the event (ownership is checked in controller)
router.put("/:id", authMiddleware, isBusiness, updateEvent);

// DELETE /api/events/:id
// Only the creator (business) can delete the event (ownership is checked in controller)
router.delete("/:id", authMiddleware, isBusiness, deleteEvent);

export default router;
