import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import TimetableGrid from "../components/timetable/TimetableGrid";

const StudentDashboard = () => {
  const [timetableDoc, setTimetableDoc] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/timetable/view");

      // Store entire timetable document
      setTimetableDoc(res.data.data[0]);
    };

    fetchData();
  }, []);

  if (!timetableDoc) return null;

  const division = timetableDoc.generatedSchedules[0];

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Student Dashboard
      </h1>

      <h2 className="text-xl mb-2">
        {division.division}
      </h2>

      <TimetableGrid
        timetable={division.timetable}
        timetableId={timetableDoc._id}
        divisionName={division.division}
      />
    </div>
  );
};

export default StudentDashboard;
