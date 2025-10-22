export const generateTimetable = (data) => {
  const {
    subjects = [],
    startTime = "09:00",
    endTime = "17:00",
    workingDaysPerWeek = 5,
    breakDuration = 30,
  } = data || {};

  // Helpers
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
    if (h >= 1 && h <= 7) h += 12; // handle 04:00 → 16:00
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const start = normalizeTime(startTime);
  const end = normalizeTime(endTime);

  const dayStart = timeToMinutes(start);
  const dayEnd = timeToMinutes(end);
  const minutesPerDay = dayEnd - dayStart;
  const slotDuration = 60;
  const slotsPerDay = Math.floor(minutesPerDay / (slotDuration + breakDuration));

  // Normalize subjects
  const normalized = subjects.map((s) => ({
    ...s,
    duration: s.durationPerLecture || 60,
    lectures:
      s.lectures ||
      Math.floor((s.totalDuration || 0) / (s.durationPerLecture || 60)) ||
      1,
    isLab: /lab/i.test(s.name),
  }));

  const labs = normalized.filter((s) => s.isLab);
  const others = normalized.filter((s) => !s.isLab);

  // Timetable skeleton
  const timetable = Array.from({ length: workingDaysPerWeek }, (_, i) => ({
    day: `Day ${i + 1}`,
    slots: [],
  }));

  // STEP 1️⃣: Place LABS (always morning + in pairs)
  labs.forEach((lab, labIndex) => {
    let remaining = lab.lectures;
    let dayIdx = labIndex % workingDaysPerWeek;

    while (remaining > 0) {
      const blockSize = remaining >= 2 ? 2 : 1;
      const block = Array.from({ length: blockSize }, () => ({
        subject: lab.name,
        duration: lab.duration,
        isLab: true,
      }));

      // Find a day for labs — only first two morning slots allowed
      let placed = false;
      for (let tries = 0; tries < workingDaysPerWeek && !placed; tries++) {
        const day = (dayIdx + tries) % workingDaysPerWeek;
        const slots = timetable[day].slots;

        const noAdjacentLab =
          slots.length === 0 || !slots[slots.length - 1]?.isLab;
        const canFit = slots.length + blockSize <= slotsPerDay;

        // Labs should be placed in the first 2–3 slots ideally
        if (noAdjacentLab && canFit && slots.length < 3) {
          timetable[day].slots.push(...block);
          placed = true;
        }
      }

      remaining -= blockSize;
      dayIdx++;
    }
  });

  // STEP 2️⃣: Prepare theory sessions list
  const theoryQueue = [];
  others.forEach((s) => {
    for (let i = 0; i < s.lectures; i++) {
      theoryQueue.push({ subject: s.name, duration: s.duration, isLab: false });
    }
  });

  // Shuffle theory sessions to improve variety
  theoryQueue.sort(() => Math.random() - 0.5);

  // STEP 3️⃣: Place theory subjects avoiding consecutive-day repeats
  const lastSubjectOnDay = Array(workingDaysPerWeek).fill(null);

  let index = 0;
  while (index < theoryQueue.length) {
    const session = theoryQueue[index];
    let placed = false;

    // Try to distribute fairly across days
    const shuffledDays = Array.from({ length: workingDaysPerWeek }, (_, i) => i)
      .sort(() => Math.random() - 0.5);

    for (let d of shuffledDays) {
      const slots = timetable[d].slots;
      if (
        slots.length < slotsPerDay &&
        lastSubjectOnDay[d] !== session.subject &&
        !slots.some((s) => s.subject === session.subject)
      ) {
        timetable[d].slots.push(session);
        lastSubjectOnDay[d] = session.subject;
        placed = true;
        break;
      }
    }

    if (!placed) {
      // If all days are blocked, just place in the first day with space
      for (let d = 0; d < workingDaysPerWeek && !placed; d++) {
        if (timetable[d].slots.length < slotsPerDay) {
          timetable[d].slots.push(session);
          lastSubjectOnDay[d] = session.subject;
          placed = true;
        }
      }
    }

    index++;
  }

  // STEP 4️⃣: Assign time slots to all sessions
  timetable.forEach((dayObj) => {
    let currentTime = start;
    dayObj.slots = dayObj.slots.map((slot) => {
      const start = currentTime;
      const end = addMinutes(start, slot.duration);
      currentTime = addMinutes(end, breakDuration);
      return { ...slot, start, end };
    });
  });

  // STEP 5️⃣: Total study time
  const totalStudyTime = normalized.reduce(
    (acc, s) => acc + s.lectures * (s.durationPerLecture || 60),
    0
  );

  return { totalStudyTime, timetable };
};
