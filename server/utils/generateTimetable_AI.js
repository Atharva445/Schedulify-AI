export const generateTimetable_AI = (data) => {
  const {
    branch = "CSE",
    numDivisions = 1,
    faculties = [], // [{ id, name }]
    subjects = [], // [{ name, durationPerLecture, totalDuration, facultyId }]
    startTime = "09:00",
    endTime = "17:00",
    workingDaysPerWeek = 5,
  } = data || {};

  // ---------- Helpers ----------
  const addMinutes = (time, mins) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(0, 0, 0, h, m);
    d.setMinutes(d.getMinutes() + mins);
    return d.toTimeString().slice(0, 5);
  };

  const timeToMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const normalizeTime = (time) => {
    let [h, m] = time.split(":").map(Number);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const start = normalizeTime(startTime);
  const end = normalizeTime(endTime);

  // ---------- Normalize subjects ----------
  const normalized = subjects.map((s) => ({
    ...s,
    duration: s.durationPerLecture || 60,
    lectures:
      s.lectures ||
      Math.floor((s.totalDuration || 0) / (s.durationPerLecture || 60)) ||
      1,
    isLab: /lab/i.test(s.name),
  }));

  const distributeEvenly = (items, groups) => {
    const distribution = Array.from({ length: groups }, () => []);
    let idx = 0;
    items.forEach((item) => {
      distribution[idx % groups].push(item);
      idx++;
    });
    return distribution;
  };

  // ---------- Faculty tracker (global across divisions) ----------
  const facultyBusy = {}; // facultyId -> Set of "day_start-end" keys

  const isFacultyFree = (facultyId, day, startT, endT) => {
    // if facultyId null or undefined -> treat as free (unassigned teachers allowed)
    if (facultyId == null) return true;
    const key = `${day}_${startT}-${endT}`;
    return !facultyBusy[facultyId]?.has(key);
  };

  const markFacultyBusy = (facultyId, day, startT, endT) => {
    if (facultyId == null) return; // nothing to mark if unassigned
    const key = `${day}_${startT}-${endT}`;
    if (!facultyBusy[facultyId]) facultyBusy[facultyId] = new Set();
    facultyBusy[facultyId].add(key);
  };

  // ---------- Build session units (make lab pairs consecutive) ----------
  // For each subject, create session blocks for this division:
  // - For labs: pair into 2-slot blocks when possible (duration * 2)
  // - For theory: single lecture blocks of duration
  const buildSessionsForDivision = () => {
    const sessions = [];

    normalized.forEach((s) => {
      const dur = s.duration;
      if (s.isLab) {
        // pair labs into 2-lecture consecutive blocks first
        const pairs = Math.floor(s.lectures / 2);
        for (let i = 0; i < pairs; i++) {
          sessions.push({
            subject: s.name,
            facultyId: s.facultyId ?? null,
            duration: dur * 2, // two consecutive lecture durations
            isLab: true,
            blockType: "lab-pair",
            sourceLectures: 2,
          });
        }
        // leftover single lab lecture if odd count
        if (s.lectures % 2 === 1) {
          sessions.push({
            subject: s.name,
            facultyId: s.facultyId ?? null,
            duration: dur,
            isLab: true,
            blockType: "lab-single",
            sourceLectures: 1,
          });
        }
      } else {
        // theory lectures as single blocks
        for (let i = 0; i < s.lectures; i++) {
          sessions.push({
            subject: s.name,
            facultyId: s.facultyId ?? null,
            duration: dur,
            isLab: false,
            blockType: "theory",
            sourceLectures: 1,
          });
        }
      }
    });

    return sessions;
  };

  // ---------- Create a single division timetable ----------
  const createSingleTimetable = (divisionName) => {
    // build fresh sessions for this division (so each division gets same subject counts)
    const sessions = buildSessionsForDivision();

    // shuffle to avoid identical ordering each run
    sessions.sort(() => Math.random() - 0.5);

    // distribute sessions across days (so each day gets roughly equal number of sessions)
    const perDayUnits = distributeEvenly(sessions, workingDaysPerWeek);

    const timetable = Array.from({ length: workingDaysPerWeek }, (_, i) => ({
      day: `Day ${i + 1}`,
      slots: [],
    }));

    // schedule greedily per day
    timetable.forEach((dayObj, dIndex) => {
      const units = perDayUnits[dIndex] || [];
      let currentTime = start;
      const placed = [];
      const skippedToday = []; // ✅ declare inside each day

      for (const u of units) {
        // if we already reached or exceeded end -> stop
        if (timeToMinutes(currentTime) >= timeToMinutes(end)) break;

        // compute end time for this unit
        const uEnd = addMinutes(currentTime, u.duration);

        // skip if exceeds end-of-day
        if (timeToMinutes(uEnd) > timeToMinutes(end)) {
          // can't place this unit today
          continue;
        }

        // check faculty availability (global across divisions)
        if (!isFacultyFree(u.facultyId, dayObj.day, currentTime, uEnd)) {
          // faculty busy — we will try to find a later time on same day by moving currentTime forward
          // but to keep simple greedy approach, just skip this unit for now (it may appear on another day)
          continue;
        }

        // place unit
        placed.push({
          subject: u.subject,
          facultyId: u.facultyId,
          facultyName: faculties.find(f => String(f.id) === String(u.facultyId))?.name || null, // ✅ added
          duration: u.duration,
          isLab: u.isLab,
          blockType: u.blockType,
          start: currentTime,
          end: uEnd,
        });

        // mark faculty busy globally
        markFacultyBusy(u.facultyId, dayObj.day, currentTime, uEnd);

        // advance currentTime to after placed block
        currentTime = uEnd;
      }
      // assign placed sessions (sorted by time) to day
      placed.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
      dayObj.slots = placed;
      if (skippedToday.length > 0 && dIndex < workingDaysPerWeek - 1) {
        perDayUnits[dIndex + 1].push(...skippedToday);
      }
    });

    return timetable;
  };

  // ---------- Generate all divisions ----------
  // Reset facultyBusy between different runs of the generator (function-scoped), but keep busy entries across divisions to avoid collisions
  const allDivisions = Array.from({ length: numDivisions }, (_, i) => {
    const name = `${branch}-Div-${String.fromCharCode(65 + i)}`;
    const tt = createSingleTimetable(name);
    return { name, timetable: tt };
  });

  // ---------- Return ----------
  return {
    branch,
    numDivisions,
    divisions: allDivisions,
    totalStudyTime: subjects.reduce((sum, s) => sum + (s.totalDuration || 0), 0),
    generatedSchedules: allDivisions.map((d) => ({ division: d.name, timetable: d.timetable })),
  };
};  
