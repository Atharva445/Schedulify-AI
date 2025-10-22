import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, RefreshCw, ChevronDown } from "lucide-react";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import TimetableGrid from "../components/timetable/TimetableGrid";
import TimetableStats from "../components/timetable/TimetableStats";

const Results = () => {
  const [showToast, setShowToast] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const timetable = location.state?.timetable;

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
  const generatedList = timetable.generatedSchedules || [timetable];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const generated = generatedList[selectedIndex];
  if (!generated || !Array.isArray(generated.timetable)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 text-center">
        <h1 className="text-2xl mb-4">⚠️ Invalid Timetable Data</h1>
        <p className="text-slate-400 mb-6">
          The system couldn’t load the timetable correctly.
        </p>
        <button
          onClick={() => navigate("/generate")}
          className="bg-indigo-600 px-5 py-2 rounded-lg text-white hover:bg-indigo-700 transition"
        >
          Regenerate
        </button>
      </div>
    );
  }

  // 🧠 Build grid-compatible data
  const days = generated.timetable.map((d) => d.day);
  const dates = days.map((_, i) => `Day ${i + 1}`);

  // Helper: convert time to minutes
const timeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Helper: convert minutes back to HH:MM
const addMinutes = (time, mins) => {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(0, 0, 0, h, m);
  d.setMinutes(d.getMinutes() + mins);
  return d.toTimeString().slice(0, 5);
};

// ✅ Define fixed 1-hour slots from startTime → endTime
const startTime = generated.startTime || "09:00";
const endTime = generated.endTime || "17:00";

let current = startTime;
const hourlySlots = [];
while (timeToMinutes(current) < timeToMinutes(endTime)) {
  const next = addMinutes(current, 60);
  hourlySlots.push({ start: current, end: next });
  current = next;
}

// ✅ Detect breaks (from backend)
const isBreakSlot = (startTime) => {
  if (!timetable.breakDetails || timetable.breakDetails.length === 0) return false;

  const startMins = timeToMinutes(startTime);
  return timetable.breakDetails.some((b) => {
    const breakStart = timeToMinutes(b.start);
    const breakEnd = timeToMinutes(b.end);
    return startMins >= breakStart && startMins < breakEnd;
  });
};

// ✅ Build the timetable grid data
const timetableData = hourlySlots.map(({ start, end }) => ({
  time: `${start} - ${end}`,
  slots: generated.timetable.map((day) => {
    // 🧠 Leave break cells empty (or labeled)
    if (isBreakSlot(start)) {
      return {
        subject: "Break",
        duration: "",
        priority: "",
        color: "none",
        topic: "",
        start,
        end,
        isBreak: true,
      };
    }

    // Find matching lecture for this start time
    const slot = day.slots.find((s) => s.start === start);
    if (!slot) return null;

    const duration = timeToMinutes(slot.end) - timeToMinutes(slot.start);
    return {
      subject: slot.subject,
      duration: `${duration} min`,
      priority: "Medium",
      color: "indigo",
      topic: "",
      start: slot.start,
      end: slot.end,
    };
  }),
}));



  const stats = {
    totalSubjects: timetable.totalSubjects || 0,
    studyHours: ((timetable.totalStudyDuration || 0) / 60).toFixed(1),
    breakTimes: timetable.breakDuration || 0,
    efficiency: 95,
  };

  

  // ✅ UI render
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
        <TimetableGrid
          timetableData={timetableData}
          days={days}
          dates={dates}
        />

        {/* Stats */}
        <div className="mt-8">
          <TimetableStats stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default Results;
