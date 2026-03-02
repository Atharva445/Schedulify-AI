  import {Routes, Route, Navigate } from "react-router-dom";
  import Layout from "./components/layout/Layout";
  import ProtectedRoute from "./components/ProtectedRoutes";
  import Home from "./pages/Home";
  import Generate from "./pages/Generate";
  import Results from "./pages/Results";
  import MyTimetables from "./pages/MyTimetables";

  import Login from "./pages/Login";
  import Register from "./pages/Register";

  import AddTeacher from "./pages/AddTeacher";
  import AddStudent from "./pages/AddStudent";
  import AdminDashboard from "./pages/AdminDashboard";
  import TeacherDashboard from "./pages/TeacherDashboard";
  import StudentDashboard from "./pages/StudentDashboard";

  /* ---------------- PRIVATE ROUTE ---------------- */

  // const PrivateRoute = ({ children, allowedRoles }) => {
  //   const token = localStorage.getItem("token");
  //   const role = localStorage.getItem("role");

  //   if (!token) {
  //     return <Navigate to="/login" />;
  //   }

  //   if (allowedRoles && !allowedRoles.includes(role)) {
  //     return <Navigate to="/" />;
  //   }

  //   return children;
  // };

  function App() {
    return (
      <Layout>
        <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/generate" element={<Generate />} />
          <Route path="/admin/results" element={<Results />} />
          <Route path="/admin/add-teacher" element={<AddTeacher />} />
          <Route path="/admin/add-student" element={<AddStudent />} />
        </Route>

        {/* TEACHER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        </Route>

        {/* STUDENT ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>

        {/* Shared (Logged-in users) */}
        <Route element={<ProtectedRoute allowedRoles={["admin","teacher","student"]} />}>
          <Route path="/my-timetables" element={<MyTimetables />} />
        </Route>

      </Routes>
      </Layout>
    );
  }

  export default App;
