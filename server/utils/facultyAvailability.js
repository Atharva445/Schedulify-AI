export function createFacultyAvailability(facultyList, days, slotsPerDay) {
  const map = {};

  facultyList.forEach(f => {
    map[f.id] = Array.from({ length: days }, () =>
      Array(slotsPerDay).fill(false)
    );
  });

  return map;
}
