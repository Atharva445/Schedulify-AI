import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import TimetableGrid from "../components/timetable/TimetableGrid";

const StudentDashboard = () => {
  const [division, setDivision] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/timetable/view");
      setDivision(res.data.data[0]?.generatedSchedules[0]);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Student Dashboard
      </h1>

      {division && (
        <>
          <h2 className="text-xl mb-2">
            {division.division}
          </h2>
          <TimetableGrid timetable={division.timetable} timetableId={timetable._id}/>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
