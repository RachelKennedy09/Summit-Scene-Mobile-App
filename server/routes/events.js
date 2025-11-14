// routes for /api/events
// small mini app for event endpoints

import express from "express";
import { getAllEvents, createEvent } from "../controllers/eventController.js";

const router = express.Router();

// GET /api/events
router.get("/", getAllEvents);

// POST /api/events
router.post("/", createEvent);

export default router;
