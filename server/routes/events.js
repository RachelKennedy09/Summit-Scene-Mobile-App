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

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public: anyone can see all events
router.get("/", getAllEvents);
// Public: anyone can see one event
router.get("/:id", getEventById);


// Protected: only logged-in users can create events
router.post("/", authMiddleware, createEvent);
// Protected: only the creator can update (checked in controller)
router.put("/:id", authMiddleware, updateEvent);
// Protected: only the creator can delete (checked in controller)
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
