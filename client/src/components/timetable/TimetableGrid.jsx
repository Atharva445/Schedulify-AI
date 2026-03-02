import React from "react";
import axios from "../../utils/axiosConfig";
import { FileSpreadsheet, FileDown } from "lucide-react";

const TimetableGrid = ({ timetable, timetableId, divisionName }) => {
  if (!timetable || timetable.length === 0) {
    return (
      <div className="text-center text-slate-400 py-16">
        No timetable data available
      </div>
    );
  }

  /* ================= DOWNLOAD FUNCTIONS ================= */

  const downloadPDF = async () => {
    try {
      const res = await axios.get(
        `/timetable/${timetableId}/division/${encodeURIComponent(
          divisionName
        )}/pdf`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "timetable.pdf";
      link.click();
    } catch (err) {
      console.error("PDF download failed", err);
    }
  };

  const downloadExcel = async () => {
    try {
      const res = await axios.get(
        `/timetable/${timetableId}/division/${encodeURIComponent(
          divisionName
        )}/excel`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "timetable.xlsx";
      link.click();
    } catch (err) {
      console.error("Excel download failed", err);
    }
  };

  /* ================= TIME SLOT PROCESSING ================= */

  const timeSet = new Set();

  timetable.forEach((day) => {
    day.slots.forEach((slot) => {
      timeSet.add(`${slot.start}-${slot.end}`);
    });
  });

  const timeSlots = Array.from(timeSet).sort();
  const days = timetable.map((d) => d.day);

  const getSlot = (dayName, time) => {
    const dayObj = timetable.find((d) => d.day === dayName);
    if (!dayObj) return null;

    return dayObj.slots.find(
      (s) => `${s.start}-${s.end}` === time
    );
  };

  /* ================= UI ================= */

  return (
    <div
      className="
      relative
      bg-gradient-to-br from-slate-900/80 to-slate-800/60
      backdrop-blur-xl
      border border-slate-700/40
      rounded-2xl
      shadow-2xl
      overflow-hidden
      mb-6
    "
    >
      <div className="overflow-x-auto">
        <div
          className="grid min-w-[950px]"
          style={{
            gridTemplateColumns: `140px repeat(${days.length}, 1fr)`
          }}
        >
          {/* HEADER */}
          <div className="p-4 font-semibold text-indigo-300 bg-slate-800/50 border-b border-slate-700">
            Time
          </div>

          {days.map((day) => (
            <div
              key={day}
              className="p-4 text-center font-semibold border-b border-l border-slate-700 text-slate-200 bg-slate-800/30"
            >
              {day}
            </div>
          ))}

          {/* TIME ROWS */}
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              {/* Time Column */}
              <div className="p-4 text-sm font-semibold text-indigo-300 bg-slate-800/40 border-t border-slate-700">
                {time}
              </div>

              {/* Day Columns */}
              {days.map((day) => {
                const slot = getSlot(day, time);

                return (
                  <div
                    key={`${day}-${time}`}
                    className="border-l border-t border-slate-700 p-3 min-h-[85px]"
                  >
                    {slot ? (
                      <div className="group h-full">
                        <div
                          className={`
                            h-full
                            rounded-xl
                            px-3 py-2
                            bg-gradient-to-br 
                            ${
                              slot.isLab
                                ? "from-purple-600/80 to-indigo-600/80"
                                : "from-blue-600/80 to-indigo-600/80"
                            }
                            text-white
                            shadow-md
                            hover:shadow-xl
                            hover:scale-[1.04]
                            transition-all duration-200
                            cursor-pointer
                          `}
                        >
                          {/* SUBJECT + LAB */}
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-semibold tracking-wide">
                              {slot.subject}
                            </p>

                            {slot.isLab && (
                              <span className="text-[10px] bg-white/20 px-2 py-[2px] rounded-full">
                                LAB
                              </span>
                            )}
                          </div>

                          {/* TEACHER VIEW (year exists) */}
                          {slot.year ? (
                            <>
                              <p className="text-xs text-white/80">
                                {slot.year} Year • {slot.division}
                              </p>

                              <p className="text-[11px] text-white/60">
                                {slot.branch}
                              </p>
                            </>
                          ) : (
                            /* STUDENT / ADMIN VIEW */
                            <p className="text-xs text-white/80">
                              {slot.facultyName}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full opacity-10 hover:opacity-20 transition bg-slate-800/20 rounded-lg" />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* DOWNLOAD BUTTONS */}
      <div className="absolute bottom-4 right-4 flex gap-3 z-30">
        <button
          onClick={downloadPDF}
          title="Download PDF"
          className="
            p-3 
            bg-slate-800/80 
            hover:bg-indigo-600 
            text-white 
            rounded-full 
            shadow-lg 
            transition-all
          "
        >
          <FileDown size={18} />
        </button>

        <button
          onClick={downloadExcel}
          title="Download Excel"
          className="
            p-3 
            bg-slate-800/80 
            hover:bg-emerald-600 
            text-white 
            rounded-full 
            shadow-lg 
            transition-all
          "
        >
          <FileSpreadsheet size={18} />
        </button>
      </div>
    </div>
  );
};

export default TimetableGrid;