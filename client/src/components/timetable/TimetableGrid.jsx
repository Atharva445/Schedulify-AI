import TimeSlot from "./TimeSlot";
import { Coffee } from "lucide-react";

const TimetableGrid = ({ timetableData, days, dates, faculties }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl overflow-hidden overflow-x-auto">
      {/* Header Row */}
      <div className="grid grid-cols-8 border-b border-slate-800 min-w-[1000px]">
        <div className="p-4 bg-slate-800/30">
          <span className="text-sm font-medium text-slate-400">Time</span>
        </div>

        {days.map((day, index) => (
          <div key={day} className="p-4 text-center border-l border-slate-800">
            <span className="text-sm font-semibold text-slate-200">
              {day}
            </span>
            <p className="text-xs text-slate-500 mt-1">{dates[index]}</p>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      <div className="divide-y divide-slate-800 min-w-[1000px]">
        {timetableData.map((timeSlot, index) => (
          <div key={index} className="grid grid-cols-8">
            {/* Time Column */}
            <div className="p-4 bg-slate-800/10 flex items-center justify-center">
              <span className="text-sm text-slate-400">{timeSlot.time}</span>
            </div>

            {/* Subject / Break Cells */}
            {timeSlot.slots.map((slot, slotIndex) => {
              if (!slot)
                return (
                  <div
                    key={slotIndex}
                    className="border-l border-slate-800 p-2"
                  ></div>
                );

              // ☕ If this is a break slot → render special gray card
              if (slot.isBreak) {
                return (
                  <div
                    key={slotIndex}
                    className="border-l border-slate-800 p-2 flex items-center justify-center"
                  >
                    <div className="w-full h-full bg-slate-800/40 border border-slate-700 rounded-xl p-3 flex items-center justify-center text-slate-400 gap-2">
                      <Coffee className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-slate-300">
                        Break ({slot.start} - {slot.end})
                      </span>
                    </div>
                  </div>
                );
              }

              // 🎓 Normal Lecture Slot
              return (
                <TimeSlot
                  key={slotIndex}
                  slot={slot}
                  faculties={faculties}
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
