// import Timetable from "../models/Timetable.js";
import { generateTimetable } from "../utils/generateTimetable.js";
import { generateTimetable_AI } from "../utils/generateTimetable_AI.js";
import { validateInput } from "../utils/validateInput.js";
import { normalizeAdminInput } from "../utils/normalizeAdminInput.js";

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

export const getTeacherTimetable = async (req, res) => {
  try {
    const facultyId = req.user.facultyId;

    const timetables = await Timetable.find();

    const filtered = timetables.map(tt => ({
      division: tt.division,
      timetable: tt.timetable.map(day => ({
        day: day.day,
        slots: day.slots.filter(
          slot => slot.facultyId === facultyId
        )
      }))
    }));

    res.json({ success: true, data: filtered });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStudentTimetable = async (req, res) => {
  try {
    const division = req.user.division;

    const timetable = await Timetable.findOne({ division });

    res.json({
      success: true,
      data: timetable,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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
