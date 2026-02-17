const TimetableGrid = ({ timetable }) => {
  if (!timetable || timetable.length === 0) {
    return (
      <div className="text-center text-slate-400 py-10">
        No timetable data available
      </div>
    );
  }

  // 🔹 Collect all unique time slots
  const timeSet = new Set();

  timetable.forEach((day) => {
    day.slots.forEach((slot) => {
      timeSet.add(`${slot.start}-${slot.end}`);
    });
  });

  const timeSlots = Array.from(timeSet).sort();

  const days = timetable.map((d) => d.day);

  // 🔹 Helper to find slot for a day & time
  const getSlot = (dayName, time) => {
    const dayObj = timetable.find((d) => d.day === dayName);
    if (!dayObj) return null;

    return dayObj.slots.find(
      (s) => `${s.start}-${s.end}` === time
    );
  };

  return (
    <div className="overflow-x-auto bg-slate-900 rounded-xl border border-slate-800">
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
          <>
            {/* Time column */}
            <div
              key={time}
              className="p-3 text-sm text-slate-400 border-t border-slate-800"
            >
              {time}
            </div>

            {/* Day columns */}
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
                        slot.isLab
                          ? "bg-purple-600"
                          : "bg-blue-600"
                      }`}
                    >
                      <div>{slot.subject}</div>
                      <div className="text-[10px] opacity-80">
                        Faculty: {slot.facultyId}
                      </div>
                    </div>
                  ) : (
                    <div className="h-10" />
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
};

export default TimetableGrid;
