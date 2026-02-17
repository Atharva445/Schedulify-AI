import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import TimetableGrid from "../components/timetable/TimetableGrid";

const AdminDashboard = () => {
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);

  const branches = ["CSE", "IT", "ENTC", "MECH"];
  const years = [1, 2, 3, 4];

  useEffect(() => {
    if (!branch || !year) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `/timetable?branch=${branch}&year=${year}`
        );

        // 🔥 Backend returns array
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
  }, [branch, year]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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

      {/* LOADING */}
      {loading && <p>Loading timetable...</p>}

      {/* DISPLAY */}
      {timetable &&
        timetable.generatedSchedules.map((division) => (
          <div key={division.division} className="mb-12">
            <h2 className="text-xl font-semibold mb-4">
              {division.division}
            </h2>

            <TimetableGrid timetable={division.timetable} />
          </div>
        ))}

      {!loading && branch && year && !timetable && (
        <p>No timetable found for selected branch & year.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
