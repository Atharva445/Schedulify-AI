import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "../utils/axiosConfig.js";

/* ---------------- REGISTER ---------------- */

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, division, facultyId } = req.body;

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
        division: user.division,
        facultyId: user.facultyId
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
    );


    res.json({
    success: true,
    token,
    role: user.role,
    division: user.division,
    facultyId: user.facultyId
    });


  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
