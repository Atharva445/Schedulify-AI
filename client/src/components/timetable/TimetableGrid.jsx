import React from "react";
import axios from "../../utils/axiosConfig";
import { FileSpreadsheet, FileDown } from "lucide-react";

const TimetableGrid = ({ timetable, timetableId, divisionName }) => {
//   console.log("TT ID:", timetableId);
// console.log("Division Name:", divisionName);

  if (!timetable || timetable.length === 0) {
    return (
      <div className="text-center text-slate-400 py-10">
        No timetable data available
      </div>
    );
  }

  /* ================= DOWNLOAD FUNCTIONS ================= */

  const downloadPDF = async () => {
    try {
      const res = await axios.get(
        `/timetable/${timetableId}/division/${encodeURIComponent(divisionName)}/pdf`,
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
        `/timetable/${timetableId}/division/${encodeURIComponent(divisionName)}/excel`,
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
    <div className="relative bg-slate-900 rounded-xl border border-slate-800 mb-4">

      {/* Scrollable Grid */}
      <div className="overflow-x-auto">
        <div
          className="grid min-w-[900px]"
          style={{
            gridTemplateColumns: `120px repeat(${days.length}, 1fr)`
          }}
        >
          {/* HEADER ROW */}
          <div className="p-3 font-semibold text-slate-400 border-b border-slate-800">
            Time
          </div>

          {days.map((day) => (
            <div
              key={day}
              className="p-3 text-center font-semibold border-b border-l border-slate-800 text-slate-200"
            >
              {day}
            </div>
          ))}

          {/* TIME ROWS */}
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              {/* Time Column */}
              <div className="p-3 text-sm text-slate-400 border-t border-slate-800">
                {time}
              </div>

              {/* Day Columns */}
              {days.map((day) => {
                const slot = getSlot(day, time);

                return (
                  <div
                    key={`${day}-${time}`}
                    className="border-l border-t border-slate-800 p-2"
                  >
                    {slot ? (
                      <div
                        className={`p-2 rounded text-xs font-medium text-white ${
                          slot.isLab ? "bg-purple-600" : "bg-blue-600"
                        }`}
                      >
                        <div>{slot.subject}</div>
                        <div className="text-[10px] opacity-80">
                          Faculty: {slot.facultyName}
                        </div>
                      </div>
                    ) : (
                      <div className="h-10" />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Download Buttons */}
      {/* Download Buttons */}
<div className="absolute bottom-2 right-2 flex gap-2 z-30">
  <button
    onClick={downloadPDF}
    title="Download PDF"
    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-md border border-slate-600"
  >
    <FileDown size={16} />
  </button>

  <button
    onClick={downloadExcel}
    title="Download Excel"
    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-md border border-slate-600"
  >
    <FileSpreadsheet size={16} />
  </button>
</div>


    </div>
  );
};

export default TimetableGrid;
