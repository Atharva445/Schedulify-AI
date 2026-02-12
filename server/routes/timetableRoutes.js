import express from "express";
import { createTimetable, createTimetableAI } from "../controllers/timetableController.js";
// import { protect, adminOnly, teacherOnly, studentOnly } from "../middleware/auth.js";
import {getAllTimetables,getTeacherTimetable,getStudentTimetable,getTimetablesByRole} from "../controllers/timetableController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Rule-based timetable
router.post("/generate",protect,authorizeRoles("admin"),createTimetable);


// router.get("/admin", protect, adminOnly, getAllTimetables);

router.get(
  "/teacher",
  protect,
  authorizeRoles("teacher"),
  getTeacherTimetable
);


router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentTimetable
);

router.get(
  "/view",
  protect,
  authorizeRoles("admin", "teacher", "student"),
  getTimetablesByRole
);


// ✅ AI-based timetable (optional / future)
router.post("/generate-ai", createTimetableAI);

export default router;
