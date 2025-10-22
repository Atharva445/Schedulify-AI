import Timetable from "../models/Timetable.js";
import { generateTimetable } from "../utils/generateTimetable.js";
import { generateTimetable_AI } from "../utils/generateTimetable_AI.js";

// export const createTimetable = async (req, res) => {
//   try {
//     const { subjects, days, hoursPerDay, breakDuration } = req.body;

//     if (!subjects || subjects.length === 0) {
//       return res.status(400).json({ message: "Subjects are required" });
//     }

//     const timetable = generateTimetable(subjects, days, hoursPerDay);

//     const newTimetable = new Timetable({
//       inputs: { subjects, days, hoursPerDay, breakDuration },
//       timetable,
//     });

//     await newTimetable.save();
//     res.status(201).json(newTimetable);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getAllTimetables = async (req, res) => {
//   try {
//     const timetables = await Timetable.find();
//     res.status(200).json(timetables);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const createTimetable = async (req, res) => {
  try {
    console.log("📩 Request received:", req.body);
    
    
    const data = req.body;
    const generated = generateTimetable(data);

    console.log("✅ Generated timetable:", generated);
    
      const newTimetable = new Timetable({
      ...data,
      generatedSchedules: [generated],
      totalStudyDuration: generated.totalStudyTime, // ✅ now defined
      totalSubjects: data.subjects.length,
    });

    await newTimetable.save();
    console.log("💾 Saved successfully!");
    res.status(201).json(newTimetable);
  } catch (error) {
    console.error("❌ Error in createTimetable:", error);
    res.status(500).json({ message: error.message });
  }
};


// export const createTimetableAI = async (req, res) => {
//   try {
//     console.log("📩 Request received:", req.body);
//     console.log("🧩 Controller Loaded");
//     const result = await generateTimetable_AI(req.body);
//     console.log("✅ Generated timetable successfully!");

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("❌ Error generating timetable:", error);
//     res.status(500).json({ error: error.message });
//   }
// };


export const createTimetableAI = async (req, res) => {
  try {
    console.log("📩 Request received:", req.body);

    // ✅ Call the AI-based timetable generator
    const result = generateTimetable_AI(req.body);

    if (!result || !result.generatedSchedules) {
      throw new Error("AI generator returned invalid data");
    }

    console.log("✅ Generated AI Timetable:", JSON.stringify(result, null, 2));

    // ✅ Send proper response to frontend
    res.status(200).json(result);

  } catch (error) {
    console.error("❌ Error generating timetable:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

