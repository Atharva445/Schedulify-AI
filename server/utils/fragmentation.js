import Timetable from "../models/Timetable.js";

export const getFragmentByBranch = async (branch) => {
  return await Timetable.find({ branch });
};