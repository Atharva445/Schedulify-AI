// import mongoose from "mongoose";

// const subjectSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   lectures: { type: Number, required: true },
//   durationPerLecture: { type: Number, required: true }, // in minutes
//   totalDuration: { type: Number, required: true }, // calculated field (lectures * duration)
// });

// const timetableSchema = new mongoose.Schema(
//   {
//     // 🧠 Basic user/session info
//     userId: { type: String, required: false }, // if login added later
//     createdAt: { type: Date, default: Date.now },

//     // 📚 Subjects / Tasks
//     subjects: [subjectSchema],

//     // ⏰ Schedule Settings
//     startTime: { type: String, required: true }, // e.g., "09:00"
//     endTime: { type: String, required: true },   // e.g., "17:00"
//     availableHoursPerDay: { type: Number, required: true }, // e.g., 8
//     workingDaysPerWeek: { type: Number, required: true },    // e.g., 5

//     // 🧩 Preferences
//     breakDuration: { type: Number, default: 30 }, // in minutes
//     difficultyLevel: { type: Number, default: 3, min: 1, max: 5 },

//     // 🧠 AI-generated timetable result
//     generatedSchedules: [
//       {
//         scheduleId: { type: String },
//         days: [
//           {
//             day: { type: String }, // e.g., "Monday"
//             slots: [
//               {
//                 start: { type: String }, // "09:00"
//                 end: { type: String },   // "10:00"
//                 subject: { type: String },
//                 break: { type: Boolean, default: false },
//               },
//             ],
//           },
//         ],
//       },
//     ],

//     // 📊 Summary
//     totalStudyDuration: { type: Number, required: true }, // total across all subjects (in minutes)
//     totalSubjects: { type: Number, required: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Timetable", timetableSchema);
import mongoose from "mongoose";

// 🎯 Schema for each time slot in the timetable
const slotSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
});

// 🎯 Schema for each day (like Day 1, Day 2...)
const daySchema = new mongoose.Schema({
  day: { type: String, required: true },
  slots: [slotSchema], // Array of slot objects
});

// 🎯 Schema for generated timetable schedule
const generatedScheduleSchema = new mongoose.Schema({
  totalStudyTime: { type: Number, required: true },
  timetable: [daySchema],
});

// 🎯 Main Timetable Schema
const timetableSchema = new mongoose.Schema(
  {
    subjects: [
      {
        name: { type: String, required: true },
        lectures: { type: Number, default: 0 },
        durationPerLecture: { type: Number, default: 0 },
        totalDuration: { type: Number, required: true },
      },
    ],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    availableHoursPerDay: { type: Number, required: true },
    workingDaysPerWeek: { type: Number, required: true },
    breakDuration: { type: Number, default: 30 },
    difficultyLevel: { type: Number, default: 3 },

    totalStudyDuration: { type: Number, required: true },
    totalSubjects: { type: Number, required: true },

    generatedSchedules: [generatedScheduleSchema],
  },
  { timestamps: true }
);

// 🎯 Export model
export default mongoose.model("Timetable", timetableSchema);
