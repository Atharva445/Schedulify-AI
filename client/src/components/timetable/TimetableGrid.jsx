import TimeSlot from "./TimeSlot";
import { Coffee } from "lucide-react";

const TimetableGrid = ({ timetable }) => {
  if (!timetable || timetable.length === 0) {
    return (
      <div className="text-center text-slate-400 py-10">
        No timetable data available
      </div>
    );
  }

  /* ------------------------------
     🔥 TRANSFORM BACKEND DATA
     ------------------------------ */

  // Collect all unique time ranges
  const timeSet = new Set();

  timetable.forEach((day) => {
    day.slots.forEach((slot) => {
      timeSet.add(`${slot.start}-${slot.end}`);
    });
  });

  const timeRows = Array.from(timeSet).sort();

  const days = timetable.map((d) => d.day);

  const gridData = timeRows.map((time) => {
    return {
      time,
      slots: timetable.map((day) => {
        return day.slots.find(
          (s) => `${s.start}-${s.end}` === time
        ) || null;
      }),
    };
  });

  /* ------------------------------
     🧠 RENDER
     ------------------------------ */

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl overflow-x-auto">
      
      {/* HEADER */}
      <div
        className="grid border-b border-slate-800 min-w-[900px]"
        style={{ gridTemplateColumns: `120px repeat(${days.length}, 1fr)` }}
      >
        <div className="p-4 bg-slate-800/30 text-sm font-medium text-slate-400">
          Time
        </div>

        {days.map((day) => (
          <div
            key={day}
            className="p-4 text-center border-l border-slate-800"
          >
            <div className="text-sm font-semibold text-slate-200">
              {day}
            </div>
          </div>
        ))}
      </div>

      {/* BODY */}
      <div className="divide-y divide-slate-800 min-w-[900px]">
        {gridData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid"
            style={{ gridTemplateColumns: `120px repeat(${days.length}, 1fr)` }}
          >
            {/* Time column */}
            <div className="p-4 bg-slate-800/10 flex items-center justify-center">
              <span className="text-sm text-slate-400">
                {row.time}
              </span>
            </div>

            {/* Day slots */}
            {row.slots.map((slot, colIndex) => {
              if (!slot) {
                return (
                  <div
                    key={colIndex}
                    className="border-l border-slate-800"
                  />
                );
              }

              if (slot.isBreak) {
                return (
                  <div
                    key={colIndex}
                    className="border-l border-slate-800 p-2 flex items-center justify-center"
                  >
                    <div className="w-full h-full bg-slate-800/40 border border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-300 text-sm">
                      <Coffee className="w-4 h-4 text-amber-400" />
                      Break
                    </div>
                  </div>
                );
              }

              return (
                <TimeSlot
                  key={colIndex}
                  slot={slot}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetableGrid;
