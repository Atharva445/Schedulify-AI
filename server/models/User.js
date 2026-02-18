import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
  },

  password: String,

  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    required: true,
  },

  // Academic Details (for students)
  branch: String,      // CSE / IT / ENTC / MECH
  year: Number,        // 1 / 2 / 3 / 4
  division: String,    // Division A / B

  //For teachers
  facultyId: Number

});

export default mongoose.model("User", userSchema);
