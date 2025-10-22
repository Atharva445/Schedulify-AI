import express from "express";
import { createTimetable,createTimetableAI } from "../controllers/timetableController.js";

const router = express.Router();

// ✅ This defines POST /api/timetable/generate
router.post("/generate", createTimetableAI);

export default router;
