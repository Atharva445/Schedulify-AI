// server/utils/validateInput.js

const toMinutes = (time) => {
  if (typeof time !== "string") return NaN;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export function validateInput(data) {
  if (!data) {
    throw new Error("Request body is missing");
  }

  const {
    startTime,
    endTime,
    workingDaysPerWeek,
    breaks = [],
    divisions = [],
    faculties = [],
  } = data;

  /* ---------------- BASIC TIME VALIDATION ---------------- */

  if (!startTime || !endTime) {
    throw new Error("Start time and end time are required");
  }

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  if (isNaN(start) || isNaN(end)) {
    throw new Error("Invalid time format. Use HH:MM");
  }

  if (start >= end) {
    throw new Error("Start time must be before end time");
  }

  /* ---------------- WORKING DAYS ---------------- */

  if (!workingDaysPerWeek || workingDaysPerWeek <= 0) {
    throw new Error("Working days per week must be greater than 0");
  }

  /* ---------------- BREAK VALIDATION ---------------- */

  const breakIntervals = breaks.map((b, i) => {
    if (!b.start || !b.end) {
      throw new Error(`Break ${i + 1} must have start and end time`);
    }

    const bs = toMinutes(b.start);
    const be = toMinutes(b.end);

    if (isNaN(bs) || isNaN(be)) {
      throw new Error(`Invalid break time at break ${i + 1}`);
    }

    if (bs >= be) {
      throw new Error(`Break ${i + 1} start must be before end`);
    }

    if (bs < start || be > end) {
      throw new Error(`Break ${i + 1} is outside working hours`);
    }

    return { start: bs, end: be };
  });

  // Check overlapping breaks
  breakIntervals.sort((a, b) => a.start - b.start);
  for (let i = 1; i < breakIntervals.length; i++) {
    if (breakIntervals[i].start < breakIntervals[i - 1].end) {
      throw new Error("Break times are overlapping");
    }
  }

  /* ---------------- DIVISIONS ---------------- */

  // divisions MUST exist AFTER normalization
// if (!data.divisions) {
//   throw new Error("Internal error: divisions not normalized");
// }

if (!Array.isArray(data.divisions) || data.divisions.length === 0) {
  throw new Error("At least one division is required");
}


  /* ---------------- FACULTY LIST ---------------- */

  if (!Array.isArray(faculties) || faculties.length === 0) {
    throw new Error("Faculty list is required");
  }

  const facultyIds = new Set();
  faculties.forEach((f) => {
    if (!f.id || !f.name) {
      throw new Error("Each faculty must have id and name");
    }
    if (facultyIds.has(f.id)) {
      throw new Error(`Duplicate faculty id found: ${f.id}`);
    }
    facultyIds.add(f.id);
  });

  /* ---------------- SUBJECT VALIDATION PER DIVISION ---------------- */

  divisions.forEach((div, dIdx) => {
    if (!div.name) {
      throw new Error(`Division ${dIdx + 1} is missing name`);
    }

    if (!Array.isArray(div.subjects) || div.subjects.length === 0) {
      throw new Error(`Division ${div.name} has no subjects`);
    }

    div.subjects.forEach((sub, sIdx) => {
      if (!sub.name) {
        throw new Error(
          `Subject ${sIdx + 1} in division ${div.name} is missing name`
        );
      }

      if (typeof sub.facultyId === "undefined") {
        throw new Error(
          `Subject ${sub.name} in division ${div.name} has no facultyId`
        );
      }

      if (!facultyIds.has(sub.facultyId)) {
        throw new Error(
          `FacultyId ${sub.facultyId} for subject ${sub.name} does not exist`
        );
      }

      if (!sub.isLab && (!sub.lectures || sub.lectures <= 0)) {
        throw new Error(
          `Theory subject ${sub.name} in division ${div.name} must have lectures > 0`
        );
      }

      if (sub.isLab && (!sub.labBlocks || sub.labBlocks <= 0)) {
        throw new Error(
          `Lab subject ${sub.name} in division ${div.name} must have labBlocks > 0`
        );
      }
    });
  });

  /* ---------------- CAPACITY CHECK ---------------- */

  const totalMinutes =
    end - start - breakIntervals.reduce((a, b) => a + (b.end - b.start), 0);

  const totalSlotsPerDay = Math.floor(totalMinutes / 60);

  divisions.forEach((div) => {
    let requiredSlots = 0;

    div.subjects.forEach((s) => {
      if (s.isLab) {
        requiredSlots += s.labBlocks * 2; // each lab block = 2 slots
      } else {
        requiredSlots += s.lectures;
      }
    });

    const availableSlots = totalSlotsPerDay * workingDaysPerWeek;

    if (requiredSlots > availableSlots) {
      throw new Error(
        `Division ${div.name} requires ${requiredSlots} slots but only ${availableSlots} available`
      );
    }
  });

  /* ---------------- PASSED ---------------- */

  return true;
}
