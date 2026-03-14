import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import TimetableGrid from "../components/timetable/TimetableGrid";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState(null); // 🔥 NEW
  const navigate = useNavigate();  
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);

  const branches = ["CSE", "IT", "ENTC", "MECH"];
  const years = [1, 2, 3, 4];

  // Fetch timetable only when in VIEW mode
  useEffect(() => {
    if (activeSection !== "view") return;
    if (!branch || !year) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `/timetable?branch=${branch}&year=${year}`
        );

        if (res.data.data.length > 0) {
          setTimetable(res.data.data[0]);
        } else {
          setTimetable(null);
        }

      } catch (error) {
        console.error(error);
        setTimetable(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [branch, year, activeSection]);

  return (
  <div className="p-8 text-white space-y-10">

    {/* ================= HEADER ================= */}
    <h1 className="text-3xl font-bold">Admin Control Center</h1>

    {/* ================= STATS SECTION ================= */}
    <div className="grid grid-cols-4 gap-6">
      <div className="bg-slate-900 p-6 rounded-xl shadow">
        <p className="text-gray-400 text-sm">Total Teachers</p>
        <h2 className="text-2xl font-bold mt-2">--</h2>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl shadow">
        <p className="text-gray-400 text-sm">Total Students</p>
        <h2 className="text-2xl font-bold mt-2">--</h2>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl shadow">
        <p className="text-gray-400 text-sm">Timetables Generated</p>
        <h2 className="text-2xl font-bold mt-2">--</h2>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl shadow">
        <p className="text-gray-400 text-sm">Active Divisions</p>
        <h2 className="text-2xl font-bold mt-2">--</h2>
      </div>
    </div>

    {/* ================= CONTROL PANELS ================= */}
    <div className="grid grid-cols-2 gap-8">

      {/* USER MANAGEMENT */}
      <div className="bg-slate-900 p-6 rounded-xl space-y-5 shadow">
        <h2 className="text-xl font-semibold">User Management</h2>

        <button
          onClick={() => navigate("/admin/add-teacher")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg"
        >
          ➕ Add Teacher
        </button>

        <button
          onClick={() => navigate("/admin/add-student")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg"
        >
          ➕ Add Student
        </button>

        {/* <button
          onClick={() => navigate("/admin/users")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg"
        >
          👥 View All Users
        </button> */}
      </div>

      {/* TIMETABLE MANAGEMENT */}
      <div className="bg-slate-900 p-6 rounded-xl space-y-5 shadow">
        <h2 className="text-xl font-semibold">Timetable Management</h2>

        <button
          onClick={() => navigate("/admin/generate")}
          className="w-full bg-teal-600 hover:bg-teal-700 px-4 py-3 rounded-lg"
        >
          📅 Generate Timetable
        </button>

        <button
          onClick={() => setActiveSection("view")}
          className="w-full bg-teal-600 hover:bg-teal-700 px-4 py-3 rounded-lg"
        >
          📂 View Timetables
        </button>
      </div>

    </div>

    {/* ================= VIEW SECTION ================= */}
    {activeSection === "view" && (
      <div className="bg-slate-900 p-6 rounded-xl space-y-6 shadow">

        <h2 className="text-xl font-semibold">View Timetables</h2>

        {/* FILTERS */}
        <div className="flex gap-4">
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="bg-slate-800 p-2 rounded"
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-slate-800 p-2 rounded"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </div>

        {loading && <p>Loading timetable...</p>}

        {timetable &&
          timetable.generatedSchedules.map((division) => (
            <div key={division.division} className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                {division.division}
              </h3>

              <TimetableGrid
                timetable={division.timetable}
                timetableId={timetable._id}
                divisionName={division.division}
              />
            </div>
          ))}

        {!loading && branch && year && !timetable && (
          <p>No timetable found for selected branch & year.</p>
        )}
      </div>
    )}

  </div>
);
};

export default AdminDashboard;