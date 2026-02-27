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
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* SECTION SELECTOR */}
      <div className="flex gap-6 mb-10">
        <button
          onClick={() => navigate("/generate")}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg"
        >
          Generate Timetable
        </button>

        <button
          onClick={() => setActiveSection("view")}
          className="bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-lg"
        >
          View Timetables
        </button>
      </div>

      {/* ================= GENERATE SECTION ================= */}
      {activeSection === "generate" && (
        <div className="bg-slate-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Generate New Timetable
          </h2>

          {/* 🔥 Replace this with your ScheduleSettings component */}
          <p>Schedule settings form goes here...</p>
        </div>
      )}

      {/* ================= VIEW SECTION ================= */}
      {activeSection === "view" && (
        <>
          {/* FILTERS */}
          <div className="flex gap-4 mb-8">
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
              <div key={division.division} className="mb-12">
                <h2 className="text-xl font-semibold mb-4">
                  {division.division}
                </h2>

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
        </>
      )}
    </div>
  );
};

export default AdminDashboard;