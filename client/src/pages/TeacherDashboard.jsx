import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import TimetableGrid from "../components/timetable/TimetableGrid";

const TeacherDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/timetable/view");
      setData(res.data.data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        My Timetable
      </h1>

      {data.map((tt) =>
        tt.generatedSchedules.map((division) => (
          <div key={division.division} className="mb-10">
            <h2 className="text-xl mb-2">
              {division.division}
            </h2>

            <TimetableGrid timetable={division.timetable} />
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherDashboard;
