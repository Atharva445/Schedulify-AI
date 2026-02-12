import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, RefreshCw } from "lucide-react";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import TimetableGrid from "../components/timetable/TimetableGrid";
import TimetableStats from "../components/timetable/TimetableStats";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(true);

  /* ---------------- FIXED STATE EXTRACTION ---------------- */

  const apiResponse =
    location.state?.data || location.state || null;

  console.log("📄 Timetable received in Results.jsx:", apiResponse);

  if (!apiResponse || !apiResponse.generatedSchedules) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <h1 className="text-2xl mb-4">❌ No Timetable Found</h1>
        <Button onClick={() => navigate("/generate")}>
          Go Back
        </Button>
      </div>
    );
  }

  /* ---------------- DATA EXTRACTION ---------------- */

  const generatedList = apiResponse.generatedSchedules;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const generated = generatedList[selectedIndex];

  const timetableRaw = generated.timetable;
  const breakDetails = apiResponse.breakDetails || [];

  const days = timetableRaw.map((d) => d.day);
  const dates = days.map((_, i) => `Day ${i + 1}`);

  /* ---------------- TIME HELPERS ---------------- */

  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const addMinutes = (t, mins) => {
    const [h, m] = t.split(":").map(Number);
    const d = new Date(0, 0, 0, h, m);
    d.setMinutes(d.getMinutes() + mins);
    return d.toTimeString().slice(0, 5);
  };

  const allStart = timetableRaw.flatMap(d => d.slots.map(s => s.start));
  const allEnd = timetableRaw.flatMap(d => d.slots.map(s => s.end));

  const earliest = allStart.sort()[0] || "09:00";
  const latest = allEnd.sort().slice(-1)[0] || "17:00";

  const hourlySlots = [];
  let cur = earliest;
  while (toMinutes(cur) < toMinutes(latest)) {
    const next = addMinutes(cur, 60);
    hourlySlots.push({ start: cur, end: next });
    cur = next;
  }

  /* ---------------- BUILD GRID DATA ---------------- */

  const timetableData = hourlySlots.map(({ start, end }) => ({
    time: `${start} - ${end}`,
    slots: timetableRaw.map((day) => {
      const breakSlot = breakDetails.find(
        (b) =>
          toMinutes(start) >= toMinutes(b.start) &&
          toMinutes(start) < toMinutes(b.end)
      );

      if (breakSlot) {
        return { isBreak: true, start, end };
      }

      const lecture = day.slots.find(
        (s) =>
          toMinutes(s.start) <= toMinutes(start) &&
          toMinutes(s.end) >= toMinutes(end)
      );

      return lecture
        ? {
            ...lecture,
            start: lecture.start,
            end: lecture.end,
          }
        : null;
    }),
  }));

  /* ---------------- STATS ---------------- */

  const stats = {
    totalSubjects: timetableRaw.reduce(
      (acc, d) => acc + d.slots.length,
      0
    ),
    studyHours: (apiResponse.totalStudyTime / 60).toFixed(1),
    breakTimes: breakDetails.length,
    efficiency: 95,
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="container mx-auto px-6">
        {showToast && (
          <Toast
            type="success"
            title="AI Generated Timetable 🎉"
            message="Conflict-free timetable generated successfully"
            onClose={() => setShowToast(false)}
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-slate-100">
            Your Timetable
          </h1>

          <div className="flex gap-3">
            <Button onClick={() => navigate("/generate")} variant="secondary">
              <RefreshCw className="w-4 h-4" /> Regenerate
            </Button>
          </div>
        </div>

        <div
          id="timetable-container"
          className="bg-slate-900/50 p-6 rounded-2xl"
        >
          {/* Timetable Selector */}
        {generatedList.length > 1 && (
          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
              {generatedList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`px-5 py-2 rounded-xl whitespace-nowrap transition-all text-sm font-medium
                    ${
                      selectedIndex === index
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                >
                  Timetable {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

          <TimetableGrid
            timetableData={timetableData}
            days={days}
            dates={dates}
          />
        </div>

        <div className="mt-8">
          <TimetableStats stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default Results;
