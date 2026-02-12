// server/utils/generateTimetable.js

/* ======================================================
   HELPERS
   ====================================================== */

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const toTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}`;
};

/* ======================================================
   MAIN CSP TIMETABLE GENERATOR
   ====================================================== */

export function generateTimetable(data) {
  const {
    divisions,
    startTime,
    endTime,
    workingDaysPerWeek,
  } = data;

  const SLOT_DURATION = 60;
  const dayStart = toMinutes(startTime);
  const dayEnd = toMinutes(endTime);
  const slotsPerDay = Math.floor((dayEnd - dayStart) / SLOT_DURATION);

  const days = Array.from({ length: workingDaysPerWeek }, (_, i) => i);
  const slots = Array.from({ length: slotsPerDay }, (_, i) => i);

  /* ======================================================
     STEP 1: BUILD EVENT POOL (ONCE, NO DUPLICATION)
     ====================================================== */

  const events = [];

  divisions.forEach((division) => {
    division.subjects.forEach((sub) => {
      if (sub.isLab) {
        // for (let i = 0; i < sub.labBlocks; i++) {
          events.push({
            type: "LAB",
            division: division.name,
            subject: sub.name,
            facultyId: sub.facultyId,
            blocks: sub.labBlocks, // 2 consecutive 1-hr slots
          });
        // }
      } else {
        for (let i = 0; i < sub.lectures; i++) {
          events.push({
            type: "THEORY",
            division: division.name,
            subject: sub.name,
            facultyId: sub.facultyId,
            blocks: 1,
          });
        }
      }
    });
  });

  /* ======================================================
     STEP 2: GLOBAL TIMETABLE STRUCTURE
     timetable[day][slot][division] = event | null
     ====================================================== */

  const timetable = {};
  const facultyBusy = {}; // facultyId -> day -> slot -> true

  days.forEach((d) => {
    timetable[d] = {};
    slots.forEach((s) => {
      timetable[d][s] = {};
      divisions.forEach((div) => {
        timetable[d][s][div.name] = null;
      });
    });
  });

  const isFacultyFree = (fid, d, s) =>
    !facultyBusy[fid]?.[d]?.[s];

  const markFacultyBusy = (fid, d, s) => {
    facultyBusy[fid] ??= {};
    facultyBusy[fid][d] ??= {};
    facultyBusy[fid][d][s] = true;
  };

  /* ======================================================
     STEP 3: PRIORITIZE + RANDOMIZE EVENTS
     ====================================================== */

  const labs = events.filter(e => e.type === "LAB");
  const theory = events.filter(e => e.type === "THEORY");

  shuffle(labs);
  shuffle(theory);

  const eventQueue = [...labs, ...theory];

  /* ======================================================
     STEP 4: CSP SLOT-FIRST ASSIGNMENT
     ====================================================== */

  for (const event of eventQueue) {
    let placed = false;

    const shuffledDays = shuffle([...days]);
    const shuffledSlots = shuffle([...slots]);

    for (const d of shuffledDays) {
      if (placed) break;

      for (const s of shuffledSlots) {
        if (placed) break;

        // Check slot availability for division
        if (timetable[d][s][event.division] !== null) continue;

        // LAB: needs consecutive slot
        if (event.blocks === 2) {
          if (s + 1 >= slotsPerDay) continue;
          if (
            timetable[d][s + 1][event.division] !== null ||
            !isFacultyFree(event.facultyId, d, s) ||
            !isFacultyFree(event.facultyId, d, s + 1)
          ) continue;

          // PLACE LAB
          timetable[d][s][event.division] = event;
          timetable[d][s + 1][event.division] = event;

          markFacultyBusy(event.facultyId, d, s);
          markFacultyBusy(event.facultyId, d, s + 1);

          placed = true;
        }

        // THEORY
        else {
          if (!isFacultyFree(event.facultyId, d, s)) continue;

          // avoid same subject back-to-back
          if (
            s > 0 &&
            timetable[d][s - 1][event.division]?.subject === event.subject
          ) continue;

          timetable[d][s][event.division] = event;
          markFacultyBusy(event.facultyId, d, s);

          placed = true;
        }
      }
    }

    if (!placed) {
      throw new Error(
        `❌ CSP failed: cannot place ${event.subject} (${event.type}) for ${event.division}`
      );
    }
  }

  /* ======================================================
     STEP 5: CONVERT GRID → API OUTPUT
     ====================================================== */

  const generatedSchedules = divisions.map((div) => {
    const tt = days.map((d) => {
      const slotsOut = [];

      slots.forEach((s) => {
        const e = timetable[d][s][div.name];
        if (!e) return;

        const start = dayStart + s * SLOT_DURATION;
        const end = start + SLOT_DURATION;

        slotsOut.push({
          subject: e.subject,
          facultyId: e.facultyId,
          isLab: e.type === "LAB",
          blockType: e.type === "LAB" ? "lab-hour" : "theory",
          duration: 60,
          start: toTime(start),
          end: toTime(end),
        });
      });

      return {
        day: `Day ${d + 1}`,
        slots: slotsOut,
      };
    });

    return {
      division: div.name,
      timetable: tt,
    };
  });

  /* ======================================================
     FINAL RESPONSE
     ====================================================== */

  return {
    totalStudyTime: events.reduce(
      (a, e) => a + e.blocks * 60,
      0
    ),
    generatedSchedules,
  };
}
