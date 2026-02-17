import mongoose from "mongoose";

/* ---------- SLOT ---------- */
const slotSchema = new mongoose.Schema({
  subject: String,
  facultyId: Number,
  facultyName: String,
  isLab: Boolean,
  blockType: String,
  start: String,
  end: String,
});

/* ---------- DAY ---------- */
const daySchema = new mongoose.Schema({
  day: String,
  slots: [slotSchema],
});

/* ---------- DIVISION TIMETABLE ---------- */
const divisionScheduleSchema = new mongoose.Schema({
  division: String,
  timetable: [daySchema],
});

/* ---------- MAIN SCHEMA ---------- */
const timetableSchema = new mongoose.Schema(
  {
    /* 🔥 NEW: Academic Structure */
    branch: {
      type: String,
      required: true,
    },

    year: {
      type: Number, // 1,2,3,4
      required: true,
    },

    /* 🔹 Admin input snapshot */
    startTime: String,
    endTime: String,
    workingDaysPerWeek: Number,
    breaks: [{ start: String, end: String }],
    difficultyLevel: Number,

    /* 🔹 Subjects entered once */
    subjects: [
      {
        name: String,
        facultyId: Number,
        facultyName: String,
        lectures: Number,
        isLab: Boolean,
        labBlocks: Number,
      },
    ],

    /* 🔹 Generated Output */
    generatedSchedules: [divisionScheduleSchema],

    totalStudyDuration: Number,
    totalSubjects: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Timetable", timetableSchema);
