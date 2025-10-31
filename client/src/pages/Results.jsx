import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, RefreshCw } from "lucide-react";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import TimetableGrid from "../components/timetable/TimetableGrid";
import TimetableStats from "../components/timetable/TimetableStats";

const Results = () => {
  const [showToast, setShowToast] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const timetable = location.state?.timetable;
  const faculties = timetable?.faculties || [];


  console.log("📄 Timetable received in Results.jsx:", timetable);

  // 🛑 If no timetable
  if (!timetable) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 text-center">
        <h1 className="text-2xl mb-4">❌ No Timetable Found</h1>
        <p className="text-slate-400 mb-6">
          There was an issue generating your timetable. Please try again.
        </p>
        <button
          onClick={() => navigate("/generate")}
          className="bg-indigo-600 px-5 py-2 rounded-lg text-white hover:bg-indigo-700 transition"
        >
          Go Back to Generate
        </button>
      </div>
    );
  }

  // 🔢 Handle multiple timetables (AI outputs)
  const generatedList = timetable?.generatedSchedules || [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ✅ Safely extract the selected schedule
  const generated = generatedList[selectedIndex] || {};
  const timetableDataRaw = generated.timetable || [];

  // ✅ Extract breaks safely
  const breakDetails = timetable.breakDetails || [];

  // 🧠 Build grid-compatible data
  const days = timetableDataRaw.map((d) => d.day);
  const dates = days.map((_, i) => `Day ${i + 1}`);

  // Helper: convert time to minutes
  const timeToMinutes = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  // Helper: add minutes
  const addMinutes = (time, mins) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(0, 0, 0, h, m);
    d.setMinutes(d.getMinutes() + mins);
    return d.toTimeString().slice(0, 5);
  };

  // ✅ Dynamically determine the full time range
  const allStartTimes = timetableDataRaw.flatMap((d) =>
    d.slots.map((s) => s.start)
  );
  const allEndTimes = timetableDataRaw.flatMap((d) =>
    d.slots.map((s) => s.end)
  );
  const earliestStart =
    allStartTimes.sort()[0] || timetable.startTime || "09:00";
  const latestEnd =
    allEndTimes.sort().slice(-1)[0] || timetable.endTime || "17:00";

  // ✅ Build 1-hour slots between start and end
  const hourlySlots = [];
  let current = earliestStart;
  while (timeToMinutes(current) < timeToMinutes(latestEnd)) {
    const next = addMinutes(current, 60);
    hourlySlots.push({ start: current, end: next });
    current = next;
  }

  // ✅ Detect if a slot is a break
  const isBreakSlot = (startTime) => {
    if (!breakDetails || breakDetails.length === 0) return false;
    const startMins = timeToMinutes(startTime);
    return breakDetails.some((b) => {
      const breakStart = timeToMinutes(b.start);
      const breakEnd = timeToMinutes(b.end);
      return startMins >= breakStart && startMins < breakEnd;
    });
  };

  // ✅ Build final timetable grid data
const timetableData = hourlySlots.map(({ start, end }) => ({
  time: `${start} - ${end}`,
  slots: timetableDataRaw.map((day) => {
    if (!day.slots || day.slots.length === 0) return null;

    // 🟢 Handle break
    if (isBreakSlot(start)) {
      return {
        isBreak: true,
        subject: `Break (${start} - ${end})`,
        start,
        end,
      };
    }

    // 🟢 Find a lecture that *covers* this time slot
    const covering = day.slots.find((s) => {
      const sStart = timeToMinutes(s.start);
      const sEnd = timeToMinutes(s.end);
      const cellStart = timeToMinutes(start);
      const cellEnd = timeToMinutes(end);
      return sStart <= cellStart && sEnd >= cellEnd;
    });

    // 🟣 Nothing scheduled — leave the cell empty
    if (!covering) return null;

    // 🟣 Lecture continues from a previous hour — skip duplicate rendering
    // if (covering.start !== start) return null;

    // 🟢 Lecture starts at this hour — render it
    const durationMins = timeToMinutes(covering.end) - timeToMinutes(covering.start);
    return {
    subject: covering.subject,
    facultyId: covering.facultyId,
    facultyName: covering.facultyName, // ✅ Pass it through!
    duration: `${durationMins} min`,
    color: covering.isLab ? "purple" : "indigo",
    isLab: covering.isLab,
    start: covering.start,
    end: covering.end,
};

  }),
}));


  // ✅ Stats
  const stats = {
    totalSubjects: timetableDataRaw.reduce((acc, d) => acc + d.slots.length, 0),
    studyHours: ((timetable.totalStudyTime || 0) / 60).toFixed(1),
    breakTimes: breakDetails.length || 0,
    efficiency: 95,
  };

  // ✅ UI Render
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="container mx-auto px-6">
        {showToast && (
          <Toast
            type="success"
            title="AI Generated Timetables 🎉"
            message="You can explore multiple optimized schedules below"
            onClose={() => setShowToast(false)}
          />
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
              Your AI Timetable
            </h1>
            <p className="text-slate-400">Week Overview</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Dropdown to switch between timetables */}
            {generatedList.length > 1 && (
              <div className="relative">
                <select
                  value={selectedIndex}
                  onChange={(e) => setSelectedIndex(Number(e.target.value))}
                  className="bg-slate-800 text-slate-200 px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {generatedList.map((_, i) => (
                    <option key={i} value={i}>
                      Timetable {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Button variant="secondary" onClick={() => navigate("/generate")}>
              <RefreshCw className="w-5 h-5" />
              Regenerate
            </Button>
            <Button variant="primary">
              <Calendar className="w-5 h-5" />
              Sync to Calendar
            </Button>
          </div>
        </div>

        {/* Timetable Grid */}
        <TimetableGrid timetableData={timetableData} days={days} dates={dates} faculties={faculties}/>

        {/* Stats */}
        <div className="mt-8">
          <TimetableStats stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default Results;
