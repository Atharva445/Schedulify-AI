import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import axios from "../utils/axiosConfig.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
