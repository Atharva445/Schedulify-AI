import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import {createTeacher,createStudent,getTeachersByBranch } from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import axios from "../utils/axiosConfig.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/create-teacher",protect,authorizeRoles("admin"),createTeacher
);
router.get("/teachers",protect,authorizeRoles("admin"),getTeachersByBranch);
router.post("/login", loginUser);
router.post("/create-student", protect, authorizeRoles("admin"), createStudent);

export default router;
