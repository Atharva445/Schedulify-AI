import Timetable from "../models/Timetable.js";
import { generateTimetable } from "../utils/generateTimetable.js";
import { generateTimetable_AI } from "../utils/generateTimetable_AI.js";
import { validateInput } from "../utils/validateInput.js";
import { normalizeAdminInput } from "../utils/normalizeAdminInput.js";
import axios from "../utils/axiosConfig.js";

/* ---------------- RULE-BASED TIMETABLE ---------------- */

export const createTimetable = async (req, res) => {
  try {
    const normalizedData = normalizeAdminInput(req.body);

    validateInput(normalizedData);

    const generated = await generateTimetable(normalizedData);

    const saved = await Timetable.create({
      branch: normalizedData.branch,
      year: normalizedData.year,
      startTime: normalizedData.startTime,
      endTime: normalizedData.endTime,
      workingDaysPerWeek: normalizedData.workingDaysPerWeek,
      breaks: normalizedData.breaks,
      difficultyLevel: normalizedData.difficultyLevel,
      generatedSchedules: generated.generatedSchedules,
      totalStudyDuration: generated.totalStudyTime,
      subjects: req.body.subjects,
      totalSubjects: req.body.subjects.length,
    });

    res.status(200).json({
      success: true,
      data: saved,
    });

  } catch (err) {
  console.error("FULL ERROR STACK:");
  console.error(err.stack);   // VERY IMPORTANT

  res.status(400).json({
    success: false,
    message: err.message,
  });
}
  // console.log("REQUEST BODY:", JSON.stringify(req.body, null, 2));
  // console.log("Divisions inside generator:", divisions);
};

export const getTimetablesByRole = async (req, res) => {
  try {
    const user = req.user;
    const { branch, year } = req.query;

    let filter = {};
    if (branch) filter.branch = branch;
    if (year) filter.year = Number(year);

    const timetables = await Timetable.find(filter).sort({ createdAt: -1 });

    /* ---------------- ADMIN ---------------- */
    if (user.role === "admin") {
      return res.json({ success: true, data: timetables });
    }
    console.log("Logged in user:", user);
    console.log("User role:", user.role);
    /* ---------------- TEACHER ---------------- */
    if (user.role === "teacher") {
      console.log("Teacher ID:", user._id);
      const filtered = timetables.map((tt) => ({
        ...tt._doc,
        generatedSchedules: tt.generatedSchedules.map((division) => ({
          ...division._doc,
          timetable: division.timetable.map((day) => ({
            ...day._doc,
            slots: day.slots.filter(
              (slot) =>
                slot.facultyId &&
                slot.facultyId.toString() === user._id.toString()
            ),
          })),
        })),
      }));

      return res.json({ success: true, data: filtered });
    }

    /* ---------------- STUDENT ---------------- */
    if (user.role === "student") {
      const filtered = timetables.filter(
        (tt) =>
          tt.branch === user.branch &&
          tt.year === user.year
      );

      return res.json({ success: true, data: filtered });
    }

    return res.status(403).json({ message: "Access denied" });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find();

    res.json({
      success: true,
      data: timetables,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTimetableByBranchYear = async (req, res) => {
  try {
    const { branch, year } = req.query;

    const timetable = await Timetable.find({
      branch,
      year,
    });

    res.json({
      success: true,
      data: timetable,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getTeacherTimetable = async (req, res) => {
  try {
    const facultyId = req.user.facultyId; // 🔥 use facultyId not Mongo _id

    const timetable = await Timetable.findOne().sort({ createdAt: -1 });

    if (!timetable) {
      return res.status(404).json({ message: "No timetable found" });
    }

    const filteredSchedules = timetable.generatedSchedules.map(schedule => ({
      division: schedule.division,
      timetable: schedule.timetable.map(day => ({
        day: day.day,
        slots: day.slots.filter(
          slot => slot.facultyId.toString() === req.user._id.toString()
        )
      }))
    }));

    res.json({
      success: true,
      data: filteredSchedules
    });

    
      console.log("Logged in user:", req.user);   // 🔍 DEBUG
      console.log("Teacher facultyId:", req.user.facultyId); // 🔍 DEBUG
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getStudentTimetable = async (req, res) => {
  try {
    const user = req.user;

    const timetable = await Timetable.findOne({
      branch: user.branch,
      year: user.year,
    }).sort({ createdAt: -1 });

    if (!timetable) {
      return res.status(404).json({ message: "No timetable found" });
    }

    res.json({
      success: true,
      data: timetable.generatedSchedules,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ---------------- AI-BASED TIMETABLE ---------------- */

export const createTimetableAI = async (req, res) => {
  try {
    console.log("📩 AI Timetable request received");

    // 1️⃣ VALIDATE INPUT (same rules apply)
    validateInput(req.body);

    // 2️⃣ GENERATE USING AI (await-safe)
    const result = await generateTimetable_AI(req.body);

    if (!result || !result.generatedSchedules) {
      throw new Error("AI generator returned invalid data");
    }

    console.log("✅ AI Timetable generated");

    // 3️⃣ OPTIONAL: SAVE AI RESULT (you can skip for now)
    // await Timetable.create({ ...req.body, generatedSchedules: result.generatedSchedules });

    // 4️⃣ RESPOND
    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error generating AI timetable:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
