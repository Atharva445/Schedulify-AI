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

  // const skipOverBreaks = (time) => {
  //   let nextTime = time;
  //   while (isBreakTime(nextTime)) {
  //     const activeBreak = breaksInMinutes.find(
  //       (b) =>
  //         timeToMinutes(nextTime) >= b.start &&
  //         timeToMinutes(nextTime) < b.end
  //     );
  //     if (activeBreak) {
  //       nextTime = minutesToTime(activeBreak.end);
  //     } else break;
  //   }
  //   return nextTime;
  // };
  const skipOverBreaks = (time) => {
  let nextTime = timeToMinutes(time);
  const activeBreak = breaksInMinutes.find(
    (b) => nextTime >= b.start && nextTime < b.end
  );
  // Only skip forward if we are inside a break
  if (activeBreak) {
    return minutesToTime(activeBreak.end);
  }
  return time;
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

  // 🧩 Create LAB blocks (2-hour consecutive)
  const labBlocks = [];
  labs.forEach((lab) => {
    const totalPairs = Math.floor(lab.lectures / 2);
    const remainder = lab.lectures % 2;

    for (let i = 0; i < totalPairs; i++) {
      const blockId = `${lab.name}-pair-${i}`;
      labBlocks.push(
        {
          subject: lab.name,
          duration: lab.duration,
          isLab: true,
          block: true,
          blockId,
          isStart: true,
        },
        {
          subject: lab.name,
          duration: lab.duration,
          isLab: true,
          block: true,
          blockId,
          isContinuation: true,
        }
      );
    }

    if (remainder > 0) {
      labBlocks.push({
        subject: lab.name,
        duration: lab.duration,
        isLab: true,
        block: false,
      });
      console.log("⏱ Time bounds check:", {
        start,
        end,
        totalMinutes: timeToMinutes(end) - timeToMinutes(start),
        breaksInMinutes
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

  // Combine lab + theory sessions
  const distributableSessions = [];
  let i = 0;
  while (i < labBlocks.length) {
    const current = labBlocks[i];
    if (current.isStart) {
      distributableSessions.push([current, labBlocks[i + 1]]);
      i += 2;
    } else {
      distributableSessions.push(current);
      i++;
    }
  }
  theoryBlocks.forEach((s) => distributableSessions.push(s));
  distributableSessions.sort(() => Math.random() - 0.5);

  // 🎯 Distribute evenly across days
  const distributedUnits = distributeEvenly(distributableSessions, workingDaysPerWeek);
  const distributedSessionsByDay = distributedUnits.map((units) =>
    units.flatMap((u) => (Array.isArray(u) ? u : [u]))
  );

  // 🕓 Assign sessions to time slots
  timetable.forEach((dayObj, dIndex) => {
    const sessions = distributedSessionsByDay[dIndex] || [];
    let currentTime = start;
    const validSlots = [];

    for (const slot of sessions) {
      // ✅ Keep currentTime within start–end window
      if (timeToMinutes(currentTime) >= timeToMinutes(end)) break;

      // Skip over breaks only if we’re *inside* a break
      currentTime = skipOverBreaks(currentTime);

      const slotEnd = addMinutes(currentTime, slot.duration);
      const slotStartMin = timeToMinutes(currentTime);
      const slotEndMin = timeToMinutes(slotEnd);

      // Check overlap with breaks
      const hasBreakConflict = breaksInMinutes.some(
        (b) => b.start < slotEndMin && b.end > slotStartMin
      );

      // Skip sessions that go beyond end time or overlap breaks
      if (slotEndMin > timeToMinutes(end) || hasBreakConflict) {
        currentTime = addMinutes(currentTime, slot.duration);
        continue;
      }

      // ✅ Add lecture slot
      validSlots.push({
        ...slot,
        start: currentTime,
        end: slotEnd,
      });

      currentTime = slotEnd;
    }

    // ☕ Add breaks explicitly for display
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
