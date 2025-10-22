export const generateTimetable_AI = (data) => {
  const {
    subjects = [],
    startTime = "09:00",
    endTime = "17:00",
    workingDaysPerWeek = 5,
    breakDetails = [],
  } = data || {};

  // ====================== HELPERS ======================
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

  const minutesToTime = (m) => {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return `${h.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}`;
  };

  const normalizeTime = (time) => {
    let [h, m] = time.split(":").map(Number);
    if (h >= 1 && h <= 7) h += 12;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const start = normalizeTime(startTime);
  const end = normalizeTime(endTime);

  // ====================== BREAK HANDLER ======================
  const breaksInMinutes = breakDetails.map((b) => ({
    start: timeToMinutes(b.start),
    end: timeToMinutes(b.end),
  }));

  const isBreakTime = (time) => {
    const mins = timeToMinutes(time);
    return breaksInMinutes.some((b) => mins >= b.start && mins < b.end);
  };

  const skipOverBreaks = (time) => {
    let nextTime = time;
    while (isBreakTime(nextTime)) {
      const activeBreak = breaksInMinutes.find(
        (b) =>
          timeToMinutes(nextTime) >= b.start &&
          timeToMinutes(nextTime) < b.end
      );
      if (activeBreak) {
        nextTime = minutesToTime(activeBreak.end);
      } else break;
    }
    return nextTime;
  };

  // ====================== NORMALIZATION ======================
  const normalized = subjects.map((s) => ({
    ...s,
    duration: s.durationPerLecture || 60,
    lectures:
      s.lectures ||
      Math.floor((s.totalDuration || 0) / (s.durationPerLecture || 60)) ||
      1,
    isLab: /lab/i.test(s.name),
  }));

  // ====================== DISTRIBUTION HELPER ======================
  const distributeEvenly = (items, groups) => {
    const distribution = Array.from({ length: groups }, () => []);
    let idx = 0;
    items.forEach((item) => {
      distribution[idx % groups].push(item);
      idx++;
    });
    return distribution;
  };

  // ====================== SINGLE TIMETABLE CREATOR ======================
  // const createSingleTimetable = (balanceType = "even") => {
  //   const labs = normalized.filter((s) => s.isLab);
  //   const others = normalized.filter((s) => !s.isLab);

  //   const timetable = Array.from({ length: workingDaysPerWeek }, (_, i) => ({
  //     day: `Day ${i + 1}`,
  //     slots: [],
  //   }));

  //   // 🧩 Create LAB blocks (2-hour consecutive)
  //   const labBlocks = [];
  //   labs.forEach((lab) => {
  //     const totalPairs = Math.floor(lab.lectures / 2);
  //     const remainder = lab.lectures % 2;

  //     for (let i = 0; i < totalPairs; i++) {
  //       labBlocks.push({
  //         subject: lab.name,
  //         duration: lab.duration * 2, // 2-hour block
  //         isLab: true,
  //         block: true,
  //       });
  //     }

  //     if (remainder > 0) {
  //       labBlocks.push({
  //         subject: lab.name,
  //         duration: lab.duration,
  //         isLab: true,
  //         block: false,
  //       });
  //     }
  //   });

  //   // 🧮 Add theory lectures
  //   const theoryBlocks = [];
  //   others.forEach((s) => {
  //     for (let i = 0; i < s.lectures; i++) {
  //       theoryBlocks.push({
  //         subject: s.name,
  //         duration: s.duration,
  //         isLab: false,
  //       });
  //     }
  //   });

  //   const allSessions = [...labBlocks, ...theoryBlocks].sort(
  //     () => Math.random() - 0.5
  //   );

  //   // 🎯 Distribute across days
  //   let distributed;
  //   if (balanceType === "even")
  //     distributed = distributeEvenly(allSessions, workingDaysPerWeek);
  //   else if (balanceType === "front-heavy")
  //     distributed = distributeEvenly(allSessions, workingDaysPerWeek).sort(
  //       () => 0.5 - Math.random()
  //     );
  //   else if (balanceType === "back-heavy")
  //     distributed = distributeEvenly(allSessions.reverse(), workingDaysPerWeek);

  //   // 🕓 Assign sessions to time slots
  //   timetable.forEach((dayObj, dIndex) => {
  //     const sessions = distributed[dIndex] || [];
  //     let currentTime = start;
  //     const validSlots = [];

  //     for (const slot of sessions) {
  //       // Skip breaks
  //       currentTime = skipOverBreaks(currentTime);

  //       const slotEnd = addMinutes(currentTime, slot.duration);
  //       if (timeToMinutes(slotEnd) > timeToMinutes(end)) break;

  //       validSlots.push({
  //         ...slot,
  //         start: currentTime,
  //         end: slotEnd,
  //       });

  //       currentTime = addMinutes(slotEnd, 0);
  //     }

  //     // Insert breaks explicitly
  //     breakDetails.forEach((b) => {
  //       validSlots.push({
  //         subject: "Break",
  //         start: b.start,
  //         end: b.end,
  //         isBreak: true,
  //       });
  //     });

  //     validSlots.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
  //     dayObj.slots = validSlots;
  //   });

  //   return timetable;
  // };

const createSingleTimetable = (balanceType = "even") => {
  const labs = normalized.filter((s) => s.isLab);
  const others = normalized.filter((s) => !s.isLab);

  const timetable = Array.from({ length: workingDaysPerWeek }, (_, i) => ({
    day: `Day ${i + 1}`,
    slots: [],
  }));

  // 🧩 Create LAB blocks (2-hour consecutive) - **Splitting 120 min into two 60 min blocks**
  const labBlocks = [];
  labs.forEach((lab) => {
    // Assuming lab.duration is 60 (from normalization)
    const totalPairs = Math.floor(lab.lectures / 2);
    const remainder = lab.lectures % 2;

    for (let i = 0; i < totalPairs; i++) {
      const blockId = `${lab.name}-pair-${i}`;
      
      // Push both 60-minute sessions linked by the blockId
      labBlocks.push({
        subject: lab.name,
        duration: lab.duration, // 60 min
        isLab: true,
        block: true,
        blockId: blockId,
        isStart: true, // Marker for the first part
      });
      labBlocks.push({
        subject: lab.name,
        duration: lab.duration, // 60 min
        isLab: true,
        block: true,
        blockId: blockId,
        isContinuation: true, // Marker for the second part
      });
    }

    if (remainder > 0) {
      labBlocks.push({
        subject: lab.name,
        duration: lab.duration,
        isLab: true,
        block: false,
      });
    }
  });

  // 🧮 Add theory lectures
  const theoryBlocks = [];
  others.forEach((s) => {
    for (let i = 0; i < s.lectures; i++) {
      theoryBlocks.push({
        subject: s.name,
        duration: s.duration,
        isLab: false,
      });
    }
  });

  // Group lab pairs into single "distribution" units
  const distributableSessions = [];
  let i = 0;
  while (i < labBlocks.length) {
    const current = labBlocks[i];
    if (current.isStart) {
      // It's the start of a pair, so push both items as an array unit
      const continuation = labBlocks[i + 1];
      distributableSessions.push([current, continuation]);
      i += 2;
    } else {
      // It's a single lab session (remainder)
      distributableSessions.push(current);
      i += 1;
    }
  }

  // Add all theory blocks as single units
  theoryBlocks.forEach(session => distributableSessions.push(session));

  // Randomize the order of the distributable units
  distributableSessions.sort(() => Math.random() - 0.5);


  // 🎯 Distribute across days - **MODIFIED DISTRIBUTION LOGIC**
  let distribution;
  
  // Use distributeEvenly on the *distributable units*
  let distributedUnits = distributeEvenly(distributableSessions, workingDaysPerWeek);

  // Flatten the distributed units back into sessions, ensuring lab pairs stay together
  const distributedSessionsByDay = distributedUnits.map(units => {
      const daySessions = [];
      units.forEach(unit => {
          if (Array.isArray(unit)) {
              daySessions.push(...unit); // Spread the lab pair (two 60 min blocks)
          } else {
              daySessions.push(unit); // Single session (theory or remainder lab)
          }
      });
      return daySessions;
  });

  // Apply balance type sort after initial distribution (optional, less effective now)
  if (balanceType === "front-heavy" || balanceType === "back-heavy") {
    // You'd need more complex logic to re-sort while maintaining day totals,
    // but for now, we'll stick to the flat distribution across days.
    // The sorting within distributeEvenly is what mostly drives the result.
  }
  
  distribution = distributedSessionsByDay;

  // 🕓 Assign sessions to time slots
  timetable.forEach((dayObj, dIndex) => {
    const sessions = distribution[dIndex] || []; // Use the new distribution array
    let currentTime = start;
    const validSlots = [];

    for (const slot of sessions) {
      // Skip breaks
      currentTime = skipOverBreaks(currentTime);

      const slotEnd = addMinutes(currentTime, slot.duration);
      
      // Check for overlapping breaks within the 60 min duration
      let isBreakConflict = false;
      const slotStartTimeMins = timeToMinutes(currentTime);
      const slotEndTimeMins = timeToMinutes(slotEnd);
      for(const b of breaksInMinutes) {
          if (b.start < slotEndTimeMins && b.end > slotStartTimeMins) {
              isBreakConflict = true;
              break;
          }
      }
      
      // If the slot is too long or conflicts with a break, skip it
      if (timeToMinutes(slotEnd) > timeToMinutes(end) || isBreakConflict) {
          continue; // Skip session that can't fit
      }

      validSlots.push({
        ...slot,
        start: currentTime,
        end: slotEnd,
      });

      // Advance time to the exact end of the slot.
      currentTime = slotEnd;
    }

    // Insert breaks explicitly
    breakDetails.forEach((b) => {
      validSlots.push({
        subject: "Break",
        start: b.start,
        end: b.end,
        isBreak: true,
      });
    });

    validSlots.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
    dayObj.slots = validSlots;
  });

  return timetable;
};

  // ====================== VARIANT GENERATION ======================
  const totalStudyTime = normalized.reduce(
    (acc, s) => acc + s.lectures * (s.durationPerLecture || 60),
    0
  );

  const variant1 = createSingleTimetable("even"); // evenly spread
  const variant2 = createSingleTimetable("front-heavy"); // busier start
  const variant3 = createSingleTimetable("back-heavy"); // busier end

  const generatedSchedules = [
    { timetable: variant1 },
    { timetable: variant2 },
    { timetable: variant3 },
  ];

  return {
    totalStudyTime,
    generatedSchedules,
    breakDetails,
  };
};
