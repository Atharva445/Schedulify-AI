import { useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const AddTeacher = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const branches = ["CSE", "IT", "ENTC", "MECH"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "/users/create-teacher",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage(
        `Teacher created successfully. Faculty ID: ${res.data.teacher.facultyId}`
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        branch: "",
      });

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Teacher</h2>

        {message && (
          <div className="bg-green-500/20 text-green-400 p-2 mb-4 rounded text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 text-red-400 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            name="name"
            placeholder="Teacher Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 rounded bg-slate-800 border border-slate-700"
          />

          <input
            type="email"
            name="email"
            placeholder="Teacher Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 rounded bg-slate-800 border border-slate-700"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-3 rounded bg-slate-800 border border-slate-700"
          />

          {/* Branch Dropdown */}
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="p-3 rounded bg-slate-800 border border-slate-700"
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded font-semibold"
          >
            Create Teacher
          </button>
        </form>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mt-4 text-sm text-gray-400 hover:text-white"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AddTeacher;