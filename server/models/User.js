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

  division: String,   // only for students
  facultyId: Number   // only for teachers
});

export default mongoose.model("User", userSchema);
