// routes for /api/events
// small mini app for event endpoints

import express from "express";
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// GET /api/events (all events)
router.get("/", getAllEvents);

// GET single event
router.get("/:id", getEventById);

// POST /api/events (post event)
router.post("/", createEvent);

// UPDATE event
router.put("/:id", updateEvent);

// DELETE event
router.delete("/:id", deleteEvent);

export default router;
