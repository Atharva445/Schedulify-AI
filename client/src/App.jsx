import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import Generate from "./pages/Generate";
import Results from "./pages/Results";
import MyTimetables from "./pages/MyTimetables";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

/* ---------------- PRIVATE ROUTE ---------------- */

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Only */}
          <Route
            path="/generate"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Generate />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Teacher */}
          <Route
            path="/teacher-dashboard"
            element={
              <PrivateRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </PrivateRoute>
            }
          />

          {/* Student */}
          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          {/* Logged-in users can view their TT */}
          <Route
            path="/my-timetables"
            element={
              <PrivateRoute allowedRoles={["admin", "teacher", "student"]}>
                <MyTimetables />
              </PrivateRoute>
            }
          />

          {/* Optional Results page (admin only if needed) */}
          <Route
            path="/results"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Results />
              </PrivateRoute>
            }
          />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
