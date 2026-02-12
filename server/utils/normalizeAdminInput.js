// server/utils/normalizeAdminInput.js

/* ---------------- LAB DETECTION ---------------- */

const LAB_KEYWORDS = [
  " lab",
  " laboratory",
  " practical",
  " practicals",
  "(lab)",
  "[lab]",
  "-lab",
  "_lab"
];

const LAB_SUBJECT_MAP = new Set([
  "ds lab",
  "ai lab",
  "dwm lab",
  "se lab",
  "physics practical",
  "chemistry practical"
]);

function detectIsLab(raw) {
  if (!raw?.name) return false;

  const name = raw.name.toLowerCase().trim();

  const byKeyword = LAB_KEYWORDS.some(k => name.includes(k));
  const byMap = LAB_SUBJECT_MAP.has(name);
  const byDuration =
    Number(raw.hours) >= 2 || Number(raw.duration) >= 120;

  return byMap || byKeyword || byDuration;
}

/* ---------------- NORMALIZER ---------------- */

export function normalizeAdminInput(data) {
  const {
    subjects = [],
    numDivisions,
    divisionCount,
    startTime,
    endTime,
    workingDaysPerWeek,
    breakDetails = [],
    faculties = [],
    difficultyLevel
  } = data;

  const divisionsCount = numDivisions || divisionCount;

  if (!subjects.length) {
    throw new Error("At least one subject is required");
  }

  if (!divisionsCount || divisionsCount <= 0) {
    throw new Error("Number of divisions must be greater than 0");
  }

  /* ---------- NORMALIZE SUBJECTS (ONCE) ---------- */

  const normalizedSubjects = subjects.map(raw => {
    const isLab = detectIsLab(raw);

    if (isLab) {
      return {
        name: raw.name,
        facultyId: raw.facultyId,
        isLab: true,

        // number of 1-hour consecutive slots
        labBlocks: Number(raw.hours) || 2,

        durationPerBlock: 60
      };
    }

    return {
      name: raw.name,
      facultyId: raw.facultyId,
      isLab: false,

      lectures: Number(raw.lectures) || Number(raw.hours) || 1,
      durationPerLecture: 60
    };
  });

  /* ---------- CREATE DIVISIONS (FROM NORMALIZED) ---------- */

  const divisions = Array.from({ length: divisionsCount }, (_, i) => ({
    name: `Division ${String.fromCharCode(65 + i)}`,
    subjects: normalizedSubjects.map(s => ({ ...s }))
  }));
console.table(
  divisions[0].subjects.map(s => ({
    name: s.name,
    isLab: s.isLab,
    blocks: s.isLab ? s.labBlocks : s.lectures
  }))
);

  /* ---------- RETURN CLEAN DATA ---------- */

  return {
    startTime,
    endTime,
    workingDaysPerWeek,
    difficultyLevel,
    faculties,
    breaks: breakDetails,
    divisions
  };
}
