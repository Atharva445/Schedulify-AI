import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import TimetableGrid from "../components/timetable/TimetableGrid";

const TeacherDashboard = () => {
  const [facultyTimetable, setFacultyTimetable] = useState([]);
  const facultyId = Number(localStorage.getItem("facultyId"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/timetable/view");
        const allTimetables = res.data.data;

        const structuredTimetable = [];

        allTimetables.forEach((tt) => {
          tt.generatedSchedules.forEach((division) => {
            division.timetable.forEach((dayObj) => {

              let existingDay = structuredTimetable.find(
                (d) => d.day === dayObj.day
              );

              if (!existingDay) {
                existingDay = { day: dayObj.day, slots: [] };
                structuredTimetable.push(existingDay);
              }

              // 👇 slot exists ONLY inside this block
              dayObj.slots.forEach((slot) => {
                const teacherBranch = localStorage.getItem("branch");

                  if (
                    String(slot.facultyId) === String(facultyId) &&
                    tt.branch === teacherBranch
                  ) {
                  existingDay.slots.push({
                    ...slot,
                    division: division.division,
                    year: tt.year,
                    branch: tt.branch,
                  });
                }
                console.log("Logged Faculty:", facultyId);
                console.log("Slot Faculty:", slot.facultyId);
              });
                
            });
          });
        });

        setFacultyTimetable(structuredTimetable);

      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };

    if (facultyId) {
      fetchData();
    }
  }, [facultyId]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        My Timetable
      </h1>

      {facultyTimetable.length > 0 ? (
        <TimetableGrid key={facultyId} timetable={facultyTimetable} />
      ) : (
        <p>No lectures assigned.</p>
      )}
    </div>
  );
};

export default TeacherDashboard;