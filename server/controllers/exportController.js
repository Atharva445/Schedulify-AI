import Timetable from "../models/Timetable.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

/* =========================================================
   📊 EXPORT SINGLE DIVISION AS EXCEL
========================================================= */
export const downloadDivisionExcel = async (req, res) => {
  try {
    const { id } = req.params;
const division = decodeURIComponent(req.params.division);

    const timetable = await Timetable.findById(id);
    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    const divisionData = timetable.generatedSchedules.find(
      (d) => d.division === division
    );

    if (!divisionData) {
      return res.status(404).json({ message: "Division not found" });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(divisionData.division);

    sheet.columns = [
      { header: "Day", key: "day", width: 15 },
      { header: "Start", key: "start", width: 15 },
      { header: "End", key: "end", width: 15 },
      { header: "Subject", key: "subject", width: 25 },
      { header: "Faculty", key: "faculty", width: 20 },
      { header: "Type", key: "type", width: 15 },
    ];

    divisionData.timetable.forEach((dayObj) => {
      dayObj.slots.forEach((slot) => {
        sheet.addRow({
          day: dayObj.day,
          start: slot.start,
          end: slot.end,
          subject: slot.subject,
          faculty: slot.facultyName,
          type: slot.isLab ? "Lab" : "Theory",
        });
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${division}_Timetable.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Excel Export Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};


/* =========================================================
   📄 EXPORT SINGLE DIVISION AS GRID PDF
========================================================= */
export const downloadDivisionPDF = async (req, res) => {
  try {
    const { id } = req.params;
const division = decodeURIComponent(req.params.division);

    const timetable = await Timetable.findById(id);
    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    const divisionData = timetable.generatedSchedules.find(
      (d) => d.division === division
    );

    if (!divisionData) {
      return res.status(404).json({ message: "Division not found" });
    }

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${division}_Timetable.pdf`
    );

    doc.pipe(res);

    doc.fontSize(16).text(
      `Timetable - ${division} (${timetable.branch} Year ${timetable.year})`,
      { align: "center" }
    );

    doc.moveDown(2);

    // Collect unique time slots
    const timeSet = new Set();
    divisionData.timetable.forEach((day) => {
      day.slots.forEach((slot) => {
        timeSet.add(`${slot.start}-${slot.end}`);
      });
    });

    const timeSlots = Array.from(timeSet).sort();
    const days = divisionData.timetable.map((d) => d.day);

    const tableTop = 120;
    const cellWidth = 90;
    const cellHeight = 25;

    // Draw header
    doc.fontSize(10);

    doc.text("Time", 40, tableTop);

    days.forEach((day, index) => {
      doc.text(day, 130 + index * cellWidth, tableTop);
    });

    // Draw rows
    timeSlots.forEach((time, rowIndex) => {
      const y = tableTop + (rowIndex + 1) * cellHeight;

      doc.text(time, 40, y);

      days.forEach((day, colIndex) => {
        const dayObj = divisionData.timetable.find(
          (d) => d.day === day
        );

        const slot = dayObj.slots.find(
          (s) => `${s.start}-${s.end}` === time
        );

        if (slot) {
          doc.text(
            `${slot.subject}\n${slot.facultyName}`,
            130 + colIndex * cellWidth,
            y,
            { width: cellWidth }
          );
        }
      });
    });

    doc.end();

  } catch (error) {
    console.error("PDF Export Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
