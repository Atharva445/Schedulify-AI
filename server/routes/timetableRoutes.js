import express from "express";
import { createTimetable, createTimetableAI } from "../controllers/timetableController.js";
import { protect, adminOnly, teacherOnly, studentOnly } from "../middleware/auth.js";
import {getAllTimetables,getTeacherTimetable,getStudentTimetable} from "../controllers/timetableController.js";
// import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Rule-based timetable
router.post("/generate", createTimetable);

router.get("/admin", protect, adminOnly, getAllTimetables);

router.get("/teacher", protect, teacherOnly, getTeacherTimetable);

router.get("/student", protect, studentOnly, getStudentTimetable);

// ✅ AI-based timetable (optional / future)
router.post("/generate-ai", createTimetableAI);

export default router;
