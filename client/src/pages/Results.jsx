import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, RefreshCw } from "lucide-react";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import TimetableGrid from "../components/timetable/TimetableGrid";
import TimetableStats from "../components/timetable/TimetableStats";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// 🔑 Google Calendar API setup
const CLIENT_ID =
  "749973951483-vpjlvp81nmij5amqv9l85kdujnnb5fu8.apps.googleusercontent.com";
const API_KEY = "AIzaSyDJvxVNmmH4p7crO4xSy62BPS00ASJ-n_4";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

const Results = () => {
  const [showToast, setShowToast] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const timetable = location.state?.timetable;
  const faculties = timetable?.faculties || [];

  const [googleReady, setGoogleReady] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [tokenClient, setTokenClient] = useState(null);

  console.log("📄 Timetable received in Results.jsx:", timetable);

  // 🧠 Load Google API + GIS
  useEffect(() => {
    const loadGapiAndGis = async () => {
      try {
        // Load GAPI client
        const gapiScript = document.createElement("script");
        gapiScript.src = "https://apis.google.com/js/api.js";
        gapiScript.onload = async () => {
          await new Promise((resolve) => window.gapi.load("client", resolve));
          await window.gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
          });
          console.log("✅ Google API Client loaded");

          // Load GIS (new auth library)
          const gisScript = document.createElement("script");
          gisScript.src = "https://accounts.google.com/gsi/client";
          gisScript.onload = () => {
            console.log("✅ Google Identity Services loaded");

            const client = google.accounts.oauth2.initTokenClient({
              client_id: CLIENT_ID,
              scope: SCOPES,
              callback: (tokenResponse) => {
                if (tokenResponse.error) {
                  console.error("❌ Token Error:", tokenResponse);
                } else {
                  console.log("🔑 Access token granted");
                }
              },
            });

            setTokenClient(client);
            setGoogleReady(true);
            setGoogleLoading(false);
          };
          document.body.appendChild(gisScript);
        };
        document.body.appendChild(gapiScript);
      } catch (err) {
        console.error("❌ Error loading Google APIs:", err);
        setGoogleLoading(false);
      }
    };

    loadGapiAndGis();
  }, []);

  // 🛑 Handle Missing Timetable
  if (!timetable) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 text-center">
        <h1 className="text-2xl mb-4">❌ No Timetable Found</h1>
        <p className="text-slate-400 mb-6">
          There was an issue generating your timetable. Please try again.
        </p>
        <button
          onClick={() => navigate("/generate")}
          className="bg-indigo-600 px-5 py-2 rounded-lg text-white hover:bg-indigo-700 transition"
        >
          Go Back to Generate
        </button>
      </div>
    );
  }

  // 🔢 Handle Multiple Timetables
  const generatedList = timetable?.generatedSchedules || [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const generated = generatedList[selectedIndex] || {};
  const timetableDataRaw = generated.timetable || [];

  const breakDetails = timetable.breakDetails || [];
  const days = timetableDataRaw.map((d) => d.day);
  const dates = days.map((_, i) => `Day ${i + 1}`);

  const timeToMinutes = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const addMinutes = (time, mins) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(0, 0, 0, h, m);
    d.setMinutes(d.getMinutes() + mins);
    return d.toTimeString().slice(0, 5);
  };

  const allStartTimes = timetableDataRaw.flatMap((d) =>
    d.slots.map((s) => s.start)
  );
  const allEndTimes = timetableDataRaw.flatMap((d) => d.slots.map((s) => s.end));
  const earliestStart =
    allStartTimes.sort()[0] || timetable.startTime || "09:00";
  const latestEnd =
    allEndTimes.sort().slice(-1)[0] || timetable.endTime || "17:00";

  const hourlySlots = [];
  let current = earliestStart;
  while (timeToMinutes(current) < timeToMinutes(latestEnd)) {
    const next = addMinutes(current, 60);
    hourlySlots.push({ start: current, end: next });
    current = next;
  }

  const isBreakSlot = (startTime) => {
    if (!breakDetails || breakDetails.length === 0) return false;
    const startMins = timeToMinutes(startTime);
    return breakDetails.some((b) => {
      const breakStart = timeToMinutes(b.start);
      const breakEnd = timeToMinutes(b.end);
      return startMins >= breakStart && startMins < breakEnd;
    });
  };

  const timetableData = hourlySlots.map(({ start, end }) => ({
    time: `${start} - ${end}`,
    slots: timetableDataRaw.map((day) => {
      if (!day.slots || day.slots.length === 0) return null;
      if (isBreakSlot(start)) {
        return {
          isBreak: true,
          subject: `Break (${start} - ${end})`,
          start,
          end,
        };
      }

      const covering = day.slots.find((s) => {
        const sStart = timeToMinutes(s.start);
        const sEnd = timeToMinutes(s.end);
        const cellStart = timeToMinutes(start);
        const cellEnd = timeToMinutes(end);
        return sStart <= cellStart && sEnd >= cellEnd;
      });

      if (!covering) return null;

      const durationMins =
        timeToMinutes(covering.end) - timeToMinutes(covering.start);
      return {
        subject: covering.subject,
        facultyId: covering.facultyId,
        facultyName: covering.facultyName,
        duration: `${durationMins} min`,
        color: covering.isLab ? "purple" : "indigo",
        isLab: covering.isLab,
        start: covering.start,
        end: covering.end,
      };
    }),
  }));

  const stats = {
    totalSubjects: timetableDataRaw.reduce((acc, d) => acc + d.slots.length, 0),
    studyHours: ((timetable.totalStudyTime || 0) / 60).toFixed(1),
    breakTimes: breakDetails.length || 0,
    efficiency: 95,
  };

  // 🧾 Download Black & White PDF
  const downloadPDF = async () => {
    const timetableElement = document.getElementById("timetable-container");
    if (!timetableElement) {
      alert("Timetable not found!");
      return;
    }

    const clone = timetableElement.cloneNode(true);
    clone.style.background = "#ffffff";
    clone.style.color = "#000000";
    clone.style.border = "1px solid #000";
    clone.style.padding = "20px";

    clone.querySelectorAll("*").forEach((el) => {
      el.style.background = "transparent";
      el.style.color = "#000000";
      el.style.borderColor = "#000000";
      el.style.boxShadow = "none";
    });

    document.body.appendChild(clone);
    await new Promise((resolve) => setTimeout(resolve, 300));

    html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
    })
      .then((canvas) => {
        const pdf = new jsPDF("landscape", "pt", "a4");
        const imgData = canvas.toDataURL("image/png");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("AI_Timetable_BW.pdf");
      })
      .catch((err) => console.error("❌ PDF Generation Error:", err))
      .finally(() => document.body.removeChild(clone));
  };

const syncToGoogleCalendar = async () => {
  if (!googleReady || !tokenClient) {
    alert("⚠️ Google API not ready yet. Please wait a few seconds.");
    return;
  }

  tokenClient.callback = async (tokenResponse) => {
    if (tokenResponse.error) {
      console.error("Token Error:", tokenResponse);
      return;
    }

    const calendar = window.gapi.client.calendar;

    // 🗓️ Base date (start of timetable week)
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + ((1 + 7 - baseDate.getDay()) % 7)); // next Monday


    for (const dayObj of timetableDataRaw) {
      for (const slot of dayObj.slots) {
        if (slot.isBreak) continue;

        // ✅ Safely compute which day to assign the lecture to
        let dayOffset = 0;
        if (dayObj.day?.includes("Day")) {
          // Handles format like "Day 1", "Day 2", etc.
          const dayNum = parseInt(dayObj.day.replace("Day ", ""));
          if (!isNaN(dayNum)) dayOffset = dayNum - 1;
        } else if (!isNaN(dayObj.day)) {
          // Handles direct numeric days
          dayOffset = parseInt(dayObj.day) - 1;
        } else {
          // Optionally map weekday names
          const dayMap = {
            Monday: 0,
            Tuesday: 1,
            Wednesday: 2,
            Thursday: 3,
            Friday: 4,
            Saturday: 5,
            Sunday: 6,
          };
          if (dayObj.day in dayMap) dayOffset = dayMap[dayObj.day];
        }

        // Compute the actual calendar date for this day
        const eventDate = new Date(baseDate);
        eventDate.setDate(baseDate.getDate() + dayOffset);

        // Build full ISO timestamps for the start and end times
        const eventDateStr = eventDate.toISOString().split("T")[0]; // e.g. 2025-11-03
        const startDateTime = new Date(`${eventDateStr}T${slot.start}:00`);
        const endDateTime = new Date(`${eventDateStr}T${slot.end}:00`);

        // Verify valid times before creating event
        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          console.warn("⚠️ Skipped invalid time for:", slot.subject, slot.start);
          continue;
        }

        // Create event resource
        const event = {
          summary: `${slot.subject} - ${slot.facultyName || "TBA"}`,
          description: `Lecture: ${slot.subject}\nFaculty: ${slot.facultyName}`,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: "Asia/Kolkata",
          },
        };

        try {
          await calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });
          console.log("✅ Added to Calendar:", event.summary);
        } catch (error) {
          console.error("❌ Failed to add event:", error);
        }
      }
    }

    alert("🎉 All timetable lectures added to your Google Calendar!");
  };

  // Request access token (triggers Google login popup)
  tokenClient.requestAccessToken();
};


  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="container mx-auto px-6">
        {showToast && (
          <Toast
            type="success"
            title="AI Generated Timetables 🎉"
            message="You can explore multiple optimized schedules below"
            onClose={() => setShowToast(false)}
          />
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
              Your AI Timetable
            </h1>
            <p className="text-slate-400">Week Overview</p>
          </div>

          <div className="flex items-center gap-3">
            {generatedList.length > 1 && (
              <div className="relative">
                <select
                  value={selectedIndex}
                  onChange={(e) => setSelectedIndex(Number(e.target.value))}
                  className="bg-slate-800 text-slate-200 px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {generatedList.map((_, i) => (
                    <option key={i} value={i}>
                      Timetable {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Button onClick={downloadPDF} variant="secondary">
              📄 Export as PDF
            </Button>
            <Button variant="secondary" onClick={() => navigate("/generate")}>
              <RefreshCw className="w-5 h-5" />
              Regenerate
            </Button>
            <Button
              variant="primary"
              onClick={syncToGoogleCalendar}
              disabled={!googleReady}
              className={`flex items-center gap-2 ${
                !googleReady ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Calendar className="w-5 h-5" />
              {googleLoading
                ? "Initializing Google..."
                : googleReady
                ? "Sync to Calendar"
                : "Google Unavailable"}
            </Button>
          </div>
        </div>

        <div
          id="timetable-container"
          className="bg-slate-900/50 p-6 rounded-2xl shadow-lg"
        >
          <TimetableGrid
            timetableData={timetableData}
            days={days}
            dates={dates}
            faculties={faculties}
          />
        </div>

        <div className="mt-8">
          <TimetableStats stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default Results;
