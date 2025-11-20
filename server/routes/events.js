// routes for /api/events
// small mini app for event endpoints

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

// Public: anyone can see all events
router.get("/", getAllEvents);

//Protected: logged-in business users can see their own events
router.get("/mine", authMiddleware, getMyEvents);
// Public: anyone can see one event
router.get("/:id", getEventById);

// Protected: only logged-in "Business" role users can create events
router.post("/", authMiddleware, isBusiness, createEvent);
// Protected: only the creator("business") can update (checked in controller)
router.put("/:id", authMiddleware, isBusiness, updateEvent);
// Protected: only the creator("business") can delete (checked in controller)
router.delete("/:id", authMiddleware, isBusiness, deleteEvent);

export default router;
