import { useState } from 'react';
import { Plus, X, Trash2, Clock, BookOpen,User } from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Generate() {
  const [currentStep, setCurrentStep] = useState(1);
  const [durationMode, setDurationMode] = useState('total'); // 'total' or 'lecture'
  const [formData, setFormData] = useState({
    subjects: [],
    subjectDurations: {}, // { subjectName: { total: 40, lectureCount: 4, lectureDuration: 10 } }
    hoursPerDay: 8,
    workingDays: 5,
    noOfBreaks:1,
    breakDuration: 30,
    difficultyLevel: 3,
    startTime: '09:00',
    endTime: '17:00',
    breakTimes: [{ start: "12:00", end: "12:30" }]
  });

  const [newSubject, setNewSubject] = useState('');
  const navigate = useNavigate();

  const steps = [
    { id: 1, label: 'Schedule Settings' },
    { id: 2, label: 'Subjects & Duration' },
    { id: 3, label: 'Review' },
  ];
  
  const colors = ['indigo', 'teal', 'purple', 'emerald', 'amber', 'rose', 'blue', 'pink'];
  
  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      const subject = newSubject.trim();
      setFormData({
        ...formData,
        subjects: [...formData.subjects, subject],
        subjectDurations: {
          ...formData.subjectDurations,
          [subject]: durationMode === 'total' 
            ? { total: 0, lectureCount: 0, lectureDuration: 0 }
            : { total: 0, lectureCount: 0, lectureDuration: 0 }
        }
      });
      setNewSubject('');
    }
  };
  
  const removeSubject = (index) => {
    const subject = formData.subjects[index];
    const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
    const updatedDurations = { ...formData.subjectDurations };
    delete updatedDurations[subject];
    
    setFormData({
      ...formData,
      subjects: updatedSubjects,
      subjectDurations: updatedDurations
    });
  };
  
  const updateSubjectDuration = (subject, field, value) => {
  const current = formData.subjectDurations[subject] || {};
  let updated = { ...current };

  if (field === "facultyName") {
    // Keep text value as is
    updated[field] = value;
  } else {
    // Convert numeric inputs
    const numValue = parseInt(value) || 0;
    updated[field] = numValue;
  }

  // Auto-calculate total when lecture count or duration changes
  if (field === "lectureCount" || field === "lectureDuration") {
    updated.total = (updated.lectureCount || 0) * (updated.lectureDuration || 0);
  }

  setFormData({
    ...formData,
    subjectDurations: {
      ...formData.subjectDurations,
      [subject]: updated,
    },
  });
};

  
  const getTotalStudyHours = () => {
    return Object.values(formData.subjectDurations).reduce((sum, duration) => {
      return sum + (duration.total || 0);
    }, 0);
  };
  
// const handleNext = async () => {
//   // ✅ STEP 1 — FORM VALIDATIONS (before proceeding or submitting)
//   if (currentStep === 1) {
//     // Schedule Settings validations
//     if (!formData.branch || formData.branch.trim() === "") {
//       alert("Please enter your Branch / Class.");
//       return;
//     }

//     if (!formData.divisionCount || formData.divisionCount < 1) {
//       alert("Please specify the number of divisions (at least 1).");
//       return;
//     }

//     if (!formData.startTime || !formData.endTime) {
//       alert("Please select valid Start and End times.");
//       return;
//     }

//     const startMinutes = Number(formData.startTime.split(":")[0]) * 60 + Number(formData.startTime.split(":")[1]);
//     const endMinutes = Number(formData.endTime.split(":")[0]) * 60 + Number(formData.endTime.split(":")[1]);
//     if (endMinutes <= startMinutes) {
//       alert("End time must be later than start time.");
//       return;
//     }

//     if (formData.noOfBreaks && formData.breakTimes?.length > 0) {
//       const invalidBreak = formData.breakTimes.some(b => !b.start || !b.end);
//       if (invalidBreak) {
//         alert("Please enter valid start and end times for all breaks.");
//         return;
//       }
//     }
//   }

//   if (currentStep === 2) {
//     // Subjects validations
//     if (!formData.subjects || formData.subjects.length === 0) {
//       alert("Please add at least one subject.");
//       return;
//     }

//     const missingDuration = formData.subjects.some(
//       (s) => !formData.subjectDurations[s]?.lectureDuration
//     );
//     if (missingDuration) {
//       alert("Please specify lecture durations for all subjects.");
//       return;
//     }
//   }

//   // ✅ STEP 2 — NEXT STEP NAVIGATION
//   if (currentStep < steps.length) {
//     setCurrentStep((prev) => prev + 1);
//     return;
//   }

//   // ✅ STEP 3 — FINAL SUBMISSION
//   try {
//     console.log("🧾 Submitting form data:", formData);

//     // 🧩 Build backend payload
//     const payload = {
//       branch: formData.branch || "",
//       divisionCount: formData.divisionCount || 1,
//       divisions: formData.divisions || [],
//       subjects: formData.subjects.map((name) => ({
//         name,
//         lectures:
//           formData.subjectDurations[name]?.lectureCount ||
//           Math.max(
//             1,
//             Math.floor(
//               (formData.subjectDurations[name]?.total || 60) / 60
//             )
//           ),
//         durationPerLecture:
//           formData.subjectDurations[name]?.lectureDuration || 60,
//         totalDuration: formData.subjectDurations[name]?.total || 0,
//         professor:
//           formData.professors?.[name] || "Unassigned", // 👈 Optional if you add professors later
//       })),
//       startTime: formData.startTime || "09:00",
//       endTime: formData.endTime || "17:00",
//       noOfBreaks: formData.noOfBreaks || 1,
//       availableHoursPerDay: formData.hoursPerDay || 8,
//       workingDaysPerWeek: formData.workingDays || 5,
//       // breakDuration: formData.breakDuration || 30,
//       // breakDetails:
//       //   formData.breakTimes?.map((b) => ({
//       //     start: b.start,
//       //     end: b.end,
//       //   })) || [],
//       difficultyLevel: formData.difficultyLevel || 3,
//     };

//     console.log("📦 Payload sent to backend:", payload);

//     // 🛰️ POST request to backend
//     const response = await axios.post(
//       "http://localhost:5000/api/timetable/generate",
//       payload,
//       {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: false,
//       }
//     );

//     console.log("✅ Timetable generated:", response.data);

//     // ✅ STEP 4 — Navigate to results page
//     navigate("/results", { state: { timetable: response.data } });
//   } catch (error) {
//     console.error("❌ Timetable generation failed:", error);
//     alert(
//       error.response?.data?.message ||
//         "Something went wrong while generating timetable. Check console."
//     );
//   }
// };
// ---------- Helper: Build clean payload for backend ----------
const buildPayloadFromForm = (formData) => {
  // Ensure numeric conversions and sane defaults
  const branch = (formData.branch || "").trim();
  const divisionCount = Number(formData.divisionCount) || 1;
  const workingDaysPerWeek = Number(formData.workingDays) || 5;
  const availableHoursPerDay = Number(formData.hoursPerDay) || 8;
  const startTime = formData.startTime || "09:00";
  const endTime = formData.endTime || "17:00";
  const breakDetails = (formData.breakDetails || []).map((b) => ({
    start: b.start || "12:00",
    end: b.end || addMinutes(b.start || "12:00", Number(b.duration || 30)),
    duration: Number(b.duration || 30),
  }));

  // Build unique faculties list from subjectDurations[*].facultyName
  const facultyNameToId = {};
  const faculties = [];
  formData.subjects.forEach((s) => {
    const meta = formData.subjectDurations?.[s] || {};
    const fname = (meta.facultyName || "").trim();
    if (fname) {
      if (!(fname in facultyNameToId)) {
        const id = faculties.length + 1; // simple incremental id
        facultyNameToId[fname] = id;
        faculties.push({ id, name: fname });
      }
    }
  });

  // Build subjects array with facultyId (or null) and durations in minutes
  const subjects = formData.subjects.map((name) => {
    const meta = formData.subjectDurations?.[name] || {};
    // note: in your UI you used lectureDuration in minutes and total in mins
    const lectureDuration = Number(meta.lectureDuration || 60); // minutes
    const lectureCount =
      Number(meta.lectureCount) ||
      Math.max(1, Math.floor(Number(meta.total || 60) / Math.max(1, lectureDuration)));
    const totalDuration = Number(meta.total) || lectureCount * lectureDuration;

    const facultyName = (meta.facultyName || "").trim();
    const facultyId = facultyName ? facultyNameToId[facultyName] : null;

    return {
      name,
      lectures: lectureCount,
      durationPerLecture: lectureDuration,
      totalDuration,
      facultyId, // null means "Unassigned" — backend can attempt to assign from a pool
      facultyName: facultyName || null,
    };
  });

  // Optional: build divisions array (A, B, C...)
  const divisions = Array.from({ length: divisionCount }, (_, i) => ({
    name: String.fromCharCode(65 + i),
  }));

  return {
    branch,
    numDivisions: divisionCount,
    divisions,
    faculties, // [{id, name}, ...]
    subjects,
    startTime,
    endTime,
    workingDaysPerWeek,
    availableHoursPerDay,
    breakDetails,
    difficultyLevel: Number(formData.difficultyLevel || 3),
  };
};

// ---------- Replacement handleNext ----------
const handleNext = async () => {
  // STEP 1 VALIDATIONS
  if (currentStep === 1) {
    if (!formData.branch || formData.branch.trim() === "") {
      alert("Please enter your Branch / Class.");
      return;
    }
    if (!formData.divisionCount || Number(formData.divisionCount) < 1) {
      alert("Please specify the number of divisions (at least 1).");
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      alert("Please select valid Start and End times.");
      return;
    }
    const [sh, sm] = formData.startTime.split(":").map(Number);
    const [eh, em] = formData.endTime.split(":").map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    if (endMinutes <= startMinutes) {
      alert("End time must be later than start time.");
      return;
    }
    if (formData.noOfBreaks && (formData.breakDetails || []).length < Number(formData.noOfBreaks)) {
      alert("Please fill all break start/end details.");
      return;
    }
  }

  // STEP 2 VALIDATIONS
  if (currentStep === 2) {
    if (!formData.subjects || formData.subjects.length === 0) {
      alert("Please add at least one subject.");
      return;
    }
    // ensure lectureDuration is present when using lecture mode or lectureCount provided
    const missingDuration = formData.subjects.some(
      (s) => !formData.subjectDurations?.[s]?.lectureDuration
    );
    if (missingDuration) {
      alert("Please specify lecture durations for all subjects.");
      return;
    }
  }

  // go to next step if not final
  if (currentStep < steps.length) {
    setCurrentStep((p) => p + 1);
    return;
  }

  // FINAL SUBMISSION
  try {
    console.log("🧾 Submitting form data:", formData);

    const payload = buildPayloadFromForm(formData);
    console.log("📦 Payload sent to backend:", payload);

    // POST to backend
    const response = await axios.post(
      "http://localhost:5000/api/timetable/generate",
      payload,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      }
    );

    console.log("✅ Timetable generated:", response.data);
    navigate("/results", { state: { timetable: response.data } });
  } catch (error) {
    console.error("❌ Timetable generation failed:", error);
    alert(
      error.response?.data?.message ||
        "Something went wrong while generating timetable. Check console."
    );
  }
};


  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleStepClick = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };
  // Helper to add minutes to a time string like "12:00" → "12:30"
  const addMinutes = (time, mins) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(0, 0, 0, h, m);
    d.setMinutes(d.getMinutes() + mins);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-800 z-0">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500" 
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
            
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep >= stepNumber;
              const isCurrent = currentStep === stepNumber;
              
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(stepNumber)}
                  disabled={stepNumber > currentStep}
                  className="relative flex flex-col items-center z-10 group disabled:cursor-not-allowed"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-slate-800 border-2 border-slate-700 text-slate-400'
                  } ${isCurrent ? 'scale-110' : ''}`}>
                    {stepNumber}
                  </div>
                  <span className={`text-sm mt-2 transition-colors ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  } ${isCurrent ? 'font-semibold' : ''}`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Step 1: Subjects & Duration */}
        {currentStep === 2 && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-2">
                Subjects & Study Duration
              </h2>
              <p className="text-slate-400">
                Add your subjects and specify how long you need to study each one
              </p>
            </div>
            
            <div className="space-y-6">
              
              {/* Duration Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  How would you like to set duration?
                </label>
                <div className="flex gap-3 bg-slate-800/30 p-1 rounded-lg w-fit">
                  <button
                    onClick={() => setDurationMode('total')}
                    className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                      durationMode === 'total'
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Total Hours
                  </button>
                  <button
                    onClick={() => setDurationMode('lecture')}
                    className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                      durationMode === 'lecture'
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Lectures
                  </button>
                </div>
              </div>
              
              {/* Add Subject Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Add Subject
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button 
                    onClick={addSubject}
                    className="px-6 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </button>
                </div>
              </div>
              
              {/* Subjects List with Duration Input */}
              {formData.subjects.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-300">Your Subjects</h3>
                  
                  {formData.subjects.map((subject, index) => {
                    const duration = formData.subjectDurations[subject] || {};
                    const color = colors[index % colors.length];
                    
                    return (
                      <div 
                        key={index}
                        className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4 hover:border-slate-600 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
                            <span className="text-base font-semibold text-slate-100">{subject}</span>
                          </div>
                          <button
                            onClick={() => removeSubject(index)}
                            className="text-slate-400 hover:text-red-400 transition-colors p-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {/* Duration Input Fields */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {durationMode === 'total' ? (
                            <>
                              <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                  Total Hours
                                </label>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-indigo-400" />
                                  <input
                                    type="number"
                                    min="0"
                                    max="168"
                                    value={duration.total || 0}
                                    onChange={(e) => updateSubjectDuration(subject, 'total', e.target.value)}
                                    className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="0"
                                  />
                                  <span className="text-xs text-slate-400">hrs</span>
                                </div>
                              </div>
                              <div className="md:col-span-2 flex items-end">
                                <div className="w-full px-3 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                                  <p className="text-xs text-indigo-400 font-medium">
                                    {duration.total ? `${duration.total} mins total` : 'Set duration above'}
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
  {/* Number of Lectures */}
  <div>
    <label className="block text-xs font-medium text-slate-400 mb-1.5">
      No. of Lectures
    </label>
    <div className="flex items-center gap-2">
      <BookOpen className="w-4 h-4 text-purple-400" />
      <input
        type="number"
        min="0"
        max="100"
        value={duration.lectureCount || 0}
        onChange={(e) =>
          updateSubjectDuration(subject, "lectureCount", Number(e.target.value))
        }
        className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="e.g. 4"
      />
    </div>
  </div>

  {/* Per Lecture Duration */}
  <div>
    <label className="block text-xs font-medium text-slate-400 mb-1.5">
      Per Lecture (min)
    </label>
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-purple-400" />
      <input
        type="number"
        min="0"
        max="360"
        value={duration.lectureDuration || 0}
        onChange={(e) =>
          updateSubjectDuration(
            subject,
            "lectureDuration",
            Number(e.target.value)
          )
        }
        className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="e.g. 60"
      />
      <span className="text-xs text-slate-400">min</span>
    </div>
  </div>

  {/* Faculty Name */}
  <div>
    <label className="block text-xs font-medium text-slate-400 mb-1.5">
      Faculty Name
    </label>
    <div className="flex items-center gap-2">
      <User className="w-4 h-4 text-purple-400" />
      <input
        type="text"
        value={duration.facultyName || ""}
        onChange={(e) =>
          updateSubjectDuration(subject, "facultyName", e.target.value)
        }
        className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="e.g. Prof. Mehta"
      />
    </div>
  </div>

  {/* Total Duration Display */}
  {/* <div className="md:col-span-1 flex items-end">
    <div className="w-full px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
      <p className="text-xs text-purple-400 font-medium">
        {duration.total ? `${duration.total} mins` : "Set above"}
      </p>
    </div>
  </div> */}
</>

                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Total Study Hours Summary */}
                  <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-indigo-400 font-medium">Total Study Duration</p>
                        <p className="text-2xl font-bold text-indigo-300 mt-1">
                          {getTotalStudyHours()} mins
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">{formData.subjects.length} subjects</p>
                        <p className="text-xs text-slate-500 mt-1">across all subjects</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-10">
              
              <button 
                onClick={handleBack}
                className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-all"
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formData.subjects.length === 0}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Schedule Settings */}
        {currentStep === 1 && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-2">
                Schedule Settings
              </h2>
              <p className="text-slate-400">
                Configure how your timetable will be structured
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Branch / Class
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Engineering"
                  value={formData.branch || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 
                            placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                            focus:border-transparent transition-all"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  No of Divisions
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 3"
                  value={formData.divisionCount || ""}
                  onChange={(e) => {
                    const count = Number(e.target.value);
                    setFormData({
                      ...formData,
                      divisionCount: count,
                      divisions: Array.from({ length: count }, (_, i) => ({
                        name: String.fromCharCode(65 + i), // A, B, C...
                        subjects: [],
                      })),
                    });
                  }}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 
                            placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                            focus:border-transparent transition-all"
                />
              </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                     Start Time
                  </label>
                  <input 
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                     End Time
                  </label>
                  <input 
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              {/* Hours & Days */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Available Hours per Day
                  </label>
                  <input 
                    type="number"
                    min="1"
                    max="24"
                    value={formData.hoursPerDay}
                    onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Working Days per Week
                  </label>
                  <select 
                    value={formData.workingDays}
                    onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="5">5 days</option>
                    <option value="6">6 days</option>
                    <option value="7">7 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    No of breaks per day
                  </label>
                  <select 
                    value={formData.noOfBreaks}
                    onChange={(e) => setFormData({ ...formData, noOfBreaks: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              </div>
              
              {/* 🧠 Break Durations with Start/End Time Inputs */}
<div>
  <label className="block text-sm font-medium text-slate-300 mb-3">
    Break Durations (minutes)
  </label>

  {formData.noOfBreaks > 0 ? (
    <div className="space-y-3">
      {Array.from({ length: formData.noOfBreaks }, (_, i) => (
        <div
          key={i}
          className="flex flex-wrap items-center gap-4 bg-slate-800/30 border border-slate-700 rounded-xl p-4"
        >
          {/* Break Label */}
          <span className="text-slate-300 text-sm font-medium min-w-[70px]">
            Break {i + 1}:
          </span>

            {/* Break Duration */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="180"
                value={formData.breakDetails?.[i]?.duration || 30}
                onChange={(e) => {
                  const newBreaks = [...(formData.breakDetails || [])];
                  newBreaks[i] = {
                    ...(newBreaks[i] || {}),
                    duration: Number(e.target.value),
                  };
                  setFormData({ ...formData, breakDetails: newBreaks });
                }}
                className="w-20 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-400">min</span>
            </div>

            {/* Start Time */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Start</label>
              <input
                type="time"
                value={formData.breakDetails?.[i]?.start || "12:00"}
                onChange={(e) => {
                  const newBreaks = [...(formData.breakDetails || [])];
                  newBreaks[i] = {
                    ...(newBreaks[i] || {}),
                    start: e.target.value,
                  };
                  setFormData({ ...formData, breakDetails: newBreaks });
                }}
                className="w-28 px-2 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* End Time */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">End</label>
              <input
                type="time"
                value={formData.breakDetails?.[i]?.end || "12:30"}
                onChange={(e) => {
                  const newBreaks = [...(formData.breakDetails || [])];
                  newBreaks[i] = {
                    ...(newBreaks[i] || {}),
                    end: e.target.value,
                  };
                  setFormData({ ...formData, breakDetails: newBreaks });
                }}
                className="w-28 px-2 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-slate-500 text-sm">No breaks selected.</p>
    )}
  </div>

            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-10">
              <button 
                className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-all cursor-not-allowed opacity-50"
                disabled
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-2">
                Review Your Settings
              </h2>
              <p className="text-slate-400">
                Make sure everything looks good before generating your timetable
              </p>
            </div>
            
            <div className="space-y-4">
              
              {/* Subjects Review */}
              <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Subjects & Duration</h4>
                <div className="space-y-2">
                  {formData.subjects.map((subject, index) => {
                    const duration = formData.subjectDurations[subject];
                    return (
                      <div key={index} className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded-lg">
                        <span className="text-slate-200 font-medium">{subject}</span>
                        <span className="text-indigo-400 font-semibold">
                          {duration.total} {durationMode === 'total' ? 'mins' : 'mins'}
                        </span>
                      </div>
                    );
                  })}
                  <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-slate-300 font-semibold">Total Duration</span>
                    <span className="text-lg text-indigo-300 font-bold">{getTotalStudyHours()} mins</span>
                  </div>
                </div>
              </div>
              
              {/* Schedule Details */}
              <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Schedule Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs">Start Time</p>
                    <p className="text-slate-100 font-semibold mt-1">{formData.startTime}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs">End Time</p>
                    <p className="text-slate-100 font-semibold mt-1">{formData.endTime}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs">Hours/Day</p>
                    <p className="text-slate-100 font-semibold mt-1">{formData.hoursPerDay} hrs</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs">Working Days</p>
                    <p className="text-slate-100 font-semibold mt-1">{formData.workingDays}/week</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs">No of Breaks</p>
                    <p className="text-slate-100 font-semibold mt-1">{formData.noOfBreaks}/week</p>
                  </div>
                  {/* <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs">Break Duration</p>
                    <p className="text-slate-100 font-semibold mt-1">{formData.breakDuration} min</p>
                  </div> */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs">Difficulty</p>
                    <p className="text-slate-100 font-semibold mt-1">Level {formData.difficultyLevel}</p>
                  </div>
                </div>
              </div>
              
              {/* Info Banner */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-emerald-300 font-semibold mb-1">Ready to generate!</p>
                  <p className="text-xs text-emerald-400/70">
                    Your AI timetable will be created based on these settings. You'll be able to view, modify, and sync it to your calendar.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-10">
              <button 
                onClick={handleBack}
                className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-all"
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
              >
                Generate Timetable
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}