const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const toTime = (m) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function buildTimeGrid(startTime, endTime, breaks) {
  const LECTURE = 60;
  let cursor = toMinutes(startTime);
  const end = toMinutes(endTime);

  const breakMap = breaks.map(b => ({
    start: toMinutes(b.start),
    end: toMinutes(b.end)
  }));

  const grid = [];

  while (cursor + LECTURE <= end) {
    const inBreak = breakMap.some(
      b => cursor >= b.start && cursor < b.end
    );

    if (inBreak) {
      cursor += 1;
      continue;
    }

    grid.push({
      start: toTime(cursor),
      end: toTime(cursor + LECTURE),
      blocked: false
    });

    cursor += LECTURE;
  }

  return grid;
}
