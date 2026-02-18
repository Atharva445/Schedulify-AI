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

    console.log(
      "✅ Divisions after normalization:",
      normalizedData.divisions.map(d => ({
        name: d.name,
        subjects: d.subjects.length
      }))
    );

    validateInput(normalizedData);

    const generated = generateTimetable(normalizedData);

    await Timetable.create({
      branch: req.body.branch,
      year: req.body.year,
      divisions: normalizedData.divisions,
      generatedSchedules: generated.generatedSchedules,
      totalStudyTime: generated.totalStudyTime
    });

    res.status(200).json({
      success: true,
      data: generated
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const getTimetablesByRole = async (req, res) => {
  try {
    const user = req.user;
    const { branch, year } = req.query;

    let filter = {};

    if (branch) filter.branch = branch;
    if (year) filter.year = Number(year);

    const timetables = await Timetable.find(filter);

    // ADMIN FILTER SUPPORT
    if (user.role === "admin") {
      const { branch, year } = req.query;

      const filter = {};
      if (branch) filter.branch = branch;
      if (year) filter.year = Number(year);

      const timetables = await Timetable.find(filter).sort({ createdAt: -1 });

      return res.json({ success: true, data: timetables });
    }


    if (user.role === "teacher") {
      const filtered = timetables.map((tt) => ({
        ...tt._doc,
        generatedSchedules: tt.generatedSchedules.map((division) => ({
          ...division,
          timetable: division.timetable.map((day) => ({
            ...day,
            slots: day.slots.filter(
              (slot) => slot.facultyId == user.facultyId
            ),
          })),
        })),
      }));

      return res.json({ success: true, data: filtered });
    }

    if (user.role === "student") {
      const filtered = timetables.map((tt) => ({
        ...tt._doc,
        generatedSchedules: tt.generatedSchedules.filter(
          (division) => division.division === user.division
        ),
      }));

      return res.json({ success: true, data: filtered });
    }

    res.status(403).json({ message: "Access denied" });

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
    const teacherId = req.user.id; // from JWT

    const timetable = await Timetable.findOne().sort({ createdAt: -1 });

    if (!timetable) {
      return res.status(404).json({ message: "No timetable found" });
    }

    const filteredSchedules = timetable.generatedSchedules.map(schedule => ({
      division: schedule.division,
      timetable: schedule.timetable.map(day => ({
        day: day.day,
        slots: day.slots.filter(slot => slot.facultyId === teacherId)
      }))
    }));

    res.json({
      success: true,
      data: filteredSchedules
    });

  } catch (error) {
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
