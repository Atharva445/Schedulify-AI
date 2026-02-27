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
    branch: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    startTime: String,
    endTime: String,
    workingDaysPerWeek: Number,
    breaks: [{ start: String, end: String }],
    difficultyLevel: Number,

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

    generatedSchedules: [divisionScheduleSchema],

    totalStudyDuration: Number,
    totalSubjects: Number,
  },
  { timestamps: true }
);

/* 🔥 Prevent duplicate timetable for same branch + year */
timetableSchema.index({ branch: 1, year: 1 }, { unique: true });

export default mongoose.model("Timetable", timetableSchema);