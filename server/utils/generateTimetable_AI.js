// export const generateTimetable_AI = (data) => {
//   const {
//     subjects = [],
//     startTime = "09:00",
//     endTime = "17:00",
//     workingDaysPerWeek = 5,
//     breakDuration = 30,
//   } = data || {};

//   // ====================== HELPERS ======================
//   const addMinutes = (time, mins) => {
//     const [h, m] = time.split(":").map(Number);
//     const d = new Date(0, 0, 0, h, m);
//     d.setMinutes(d.getMinutes() + mins);
//     return d.toTimeString().slice(0, 5);
//   };
//   const timeToMinutes = (t) => {
//     const [h, m] = t.split(":").map(Number);
//     return h * 60 + m;
//   };
//   const normalizeTime = (time) => {
//     let [h, m] = time.split(":").map(Number);
//     if (h >= 1 && h <= 7) h += 12; // handle early AM
//     return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
//   };

//   const start = normalizeTime(startTime);
//   const end = normalizeTime(endTime);
//   const dayStart = timeToMinutes(start);
//   const dayEnd = timeToMinutes(end);
//   const minutesPerDay = dayEnd - dayStart;
//   const slotDuration = 60;
//   const slotsPerDay = Math.floor(minutesPerDay / (slotDuration + breakDuration));

//   // ====================== NORMALIZATION ======================
//   const normalized = subjects.map((s) => ({
//     ...s,
//     duration: s.durationPerLecture || 60,
//     lectures:
//       s.lectures ||
//       Math.floor((s.totalDuration || 0) / (s.durationPerLecture || 60)) ||
//       1,
//     isLab: /lab/i.test(s.name),
//   }));

//   // ====================== SINGLE TIMETABLE CREATOR ======================
//   const createSingleTimetable = () => {
//     const labs = normalized.filter((s) => s.isLab);
//     const others = normalized.filter((s) => !s.isLab);

//     // Base timetable skeleton
//     const timetable = Array.from({ length: workingDaysPerWeek }, (_, i) => ({
//       day: `Day ${i + 1}`,
//       slots: [],
//     }));

//     // STEP 1️⃣: Place LABS (morning, in pairs)
//     labs.forEach((lab, labIndex) => {
//       let remaining = lab.lectures;
//       let dayIdx = labIndex % workingDaysPerWeek;

//       while (remaining > 0) {
//         const blockSize = remaining >= 2 ? 2 : 1;
//         const block = Array.from({ length: blockSize }, () => ({
//           subject: lab.name,
//           duration: lab.duration,
//           isLab: true,
//         }));

//         let placed = false;
//         for (let tries = 0; tries < workingDaysPerWeek && !placed; tries++) {
//           const day = (dayIdx + tries) % workingDaysPerWeek;
//           const slots = timetable[day].slots;

//           const noAdjacentLab =
//             slots.length === 0 || !slots[slots.length - 1]?.isLab;
//           const canFit = slots.length + blockSize <= slotsPerDay;

//           if (noAdjacentLab && canFit && slots.length < 3) {
//             timetable[day].slots.push(...block);
//             placed = true;
//           }
//         }

//         remaining -= blockSize;
//         dayIdx++;
//       }
//     });

//     // STEP 2️⃣: Theory queue
//     const theoryQueue = [];
//     others.forEach((s) => {
//       for (let i = 0; i < s.lectures; i++) {
//         theoryQueue.push({ subject: s.name, duration: s.duration, isLab: false });
//       }
//     });
//     theoryQueue.sort(() => Math.random() - 0.5);

//     // STEP 3️⃣: Distribute theory lectures evenly
//     const lastSubjectOnDay = Array(workingDaysPerWeek).fill(null);
//     let index = 0;
//     while (index < theoryQueue.length) {
//       const session = theoryQueue[index];
//       let placed = false;
//       const shuffledDays = Array.from({ length: workingDaysPerWeek }, (_, i) => i)
//         .sort(() => Math.random() - 0.5);

//       for (let d of shuffledDays) {
//         const slots = timetable[d].slots;
//         if (
//           slots.length < slotsPerDay &&
//           lastSubjectOnDay[d] !== session.subject &&
//           !slots.some((s) => s.subject === session.subject)
//         ) {
//           timetable[d].slots.push(session);
//           lastSubjectOnDay[d] = session.subject;
//           placed = true;
//           break;
//         }
//       }

//       if (!placed) {
//         for (let d = 0; d < workingDaysPerWeek && !placed; d++) {
//           if (timetable[d].slots.length < slotsPerDay) {
//             timetable[d].slots.push(session);
//             lastSubjectOnDay[d] = session.subject;
//             placed = true;
//           }
//         }
//       }
//       index++;
//     }

//     // STEP 4️⃣: Assign time slots
//     timetable.forEach((dayObj) => {
//       let currentTime = start;
//       dayObj.slots = dayObj.slots.map((slot) => {
//         const start = currentTime;
//         const end = addMinutes(start, slot.duration);
//         currentTime = addMinutes(end, breakDuration);
//         return { ...slot, start, end };
//       });
//     });

//     return timetable;
//   };

//   // ====================== VARIANT GENERATION ======================
//   const totalStudyTime = normalized.reduce(
//     (acc, s) => acc + s.lectures * (s.durationPerLecture || 60),
//     0
//   );

//   // Generate 3 variants with slight randomness
//   const variant1 = createSingleTimetable();
//   const variant2 = createSingleTimetable(); // random shuffle ensures difference
//   const variant3 = createSingleTimetable();

//   // Add mild shuffle to distinguish visually
//   const shuffleDayOrder = (tt) =>
//     tt.map((d) => ({
//       ...d,
//       slots: d.slots.sort(() => Math.random() - 0.5),
//     }));

//   const generatedSchedules = [
//     { timetable: variant1 },
//     { timetable: shuffleDayOrder(variant2) },
//     { timetable: shuffleDayOrder(variant3) },
//   ];

//   return { totalStudyTime, generatedSchedules };
// };








export const generateTimetable_AI = (data) => {
  const {
    subjects = [],
    startTime = "09:00",
    endTime = "17:00",
    workingDaysPerWeek = 5,
    breakDetails = [], // 👈 NEW: accept detailed breaks
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

  const normalizeTime = (time) => {
    let [h, m] = time.split(":").map(Number);
    if (h >= 1 && h <= 7) h += 12; // handle early AM
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const start = normalizeTime(startTime);
  const end = normalizeTime(endTime);
  const dayStart = timeToMinutes(start);
  const dayEnd = timeToMinutes(end);
  const slotDuration = 60; // 1-hour lectures

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

  // ====================== BREAK HANDLER ======================
  // Convert break times into minutes for easier checks
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
      const breakObj = breaksInMinutes.find(
        (b) => timeToMinutes(nextTime) >= b.start && timeToMinutes(nextTime) < b.end
      );
      if (breakObj) {
        nextTime = addMinutes(breakObj.end.toString().padStart(4, "0"), 0);
      } else {
        break;
      }
    }
    return nextTime;
  };

  // ====================== SINGLE TIMETABLE CREATOR ======================
  const createSingleTimetable = () => {
    const labs = normalized.filter((s) => s.isLab);
    const others = normalized.filter((s) => !s.isLab);

    const timetable = Array.from({ length: workingDaysPerWeek }, (_, i) => ({
      day: `Day ${i + 1}`,
      slots: [],
    }));

    // STEP 1️⃣: Place LABS (morning, in pairs)
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

        let placed = false;
        for (let tries = 0; tries < workingDaysPerWeek && !placed; tries++) {
          const day = (dayIdx + tries) % workingDaysPerWeek;
          const slots = timetable[day].slots;

          if (slots.length < 5) {
            timetable[day].slots.push(...block);
            placed = true;
          }
        }

        remaining -= blockSize;
        dayIdx++;
      }
    });

    // STEP 2️⃣: Theory queue
    const theoryQueue = [];
    others.forEach((s) => {
      for (let i = 0; i < s.lectures; i++) {
        theoryQueue.push({ subject: s.name, duration: s.duration, isLab: false });
      }
    });
    theoryQueue.sort(() => Math.random() - 0.5);

    // STEP 3️⃣: Distribute theory evenly
    const lastSubjectOnDay = Array(workingDaysPerWeek).fill(null);
    let index = 0;
    while (index < theoryQueue.length) {
      const session = theoryQueue[index];
      let placed = false;
      for (let d = 0; d < workingDaysPerWeek; d++) {
        const slots = timetable[d].slots;
        if (
          slots.length < 8 &&
          lastSubjectOnDay[d] !== session.subject &&
          !slots.some((s) => s.subject === session.subject)
        ) {
          timetable[d].slots.push(session);
          lastSubjectOnDay[d] = session.subject;
          placed = true;
          break;
        }
      }
      index++;
    }

    // STEP 4️⃣: Assign time slots (skipping over breaks)
    timetable.forEach((dayObj) => {
  let currentTime = start;
  const validSlots = [];

  for (const slot of dayObj.slots) {
    // 🧠 Skip if current time falls inside a break
    currentTime = skipOverBreaks(currentTime);

    // 🕓 Check if adding this lecture exceeds the day's end time
    const slotEnd = addMinutes(currentTime, slot.duration);
    if (timeToMinutes(slotEnd) > timeToMinutes(end)) {
      break; // Stop adding more slots for this day
    }

    validSlots.push({
      ...slot,
      start: currentTime,
      end: slotEnd,
    });

    // Move to next slot time (after lecture)
    currentTime = addMinutes(slotEnd, 0);
  }

  dayObj.slots = validSlots;
});
    return timetable;
  };

  // ====================== VARIANT GENERATION ======================
  const totalStudyTime = normalized.reduce(
    (acc, s) => acc + s.lectures * (s.durationPerLecture || 60),
    0
  );

  const variant1 = createSingleTimetable();
  const variant2 = createSingleTimetable();
  const variant3 = createSingleTimetable();

  const shuffleDayOrder = (tt) =>
    tt.map((d) => ({
      ...d,
      slots: d.slots.sort(() => Math.random() - 0.5),
    }));

  const generatedSchedules = [
    { timetable: variant1 },
    { timetable: shuffleDayOrder(variant2) },
    { timetable: shuffleDayOrder(variant3) },
  ];

  // Include break details in the output for frontend rendering
  return {
    totalStudyTime,
    generatedSchedules,
    breakDetails, // 👈 send back to frontend
  };
};
