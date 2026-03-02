import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "../utils/axiosConfig.js";

/* ---------------- REGISTER ---------------- */

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      branch,
      year,
      division,
      facultyId,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      branch,
      year,
      division,
      facultyId,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, email, password, branch, year, division } = req.body;

    if (!name || !email || !password || !branch || !year || !division) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      branch,
      year,
      division,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      studentId: student._id
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTeachersByBranch = async (req, res) => {
  try {
    const { branch } = req.query;

    if (!branch) {
      return res.status(400).json({ message: "Branch required" });
    }

    const teachers = await User.find({
      role: "teacher",
      branch
    }).select("name facultyId branch");

    res.json({
      success: true,
      teachers
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, branch } = req.body;

    if (!name || !email || !password || !branch) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const lastTeacher = await User.findOne({ role: "teacher", branch })
      .sort({ facultyId: -1 });

    const newFacultyId = lastTeacher ? lastTeacher.facultyId + 1 : 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      facultyId: newFacultyId,
      branch
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/* ---------------- LOGIN (JWT GENERATED HERE) ---------------- */

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        branch: user.branch,
        year: user.year,
        division: user.division,
        facultyId: user.facultyId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      role: user.role,
      branch: user.branch,
      year: user.year,
      division: user.division,
      facultyId: user.facultyId,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

