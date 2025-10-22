import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Generate from "./pages/Generate";
import Results from "./pages/Results";
import MyTimetables from "./pages/MyTimetables";

function App() {
  return (
    <Router>s
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/results" element={<Results />} />
          <Route path="/my-timetables" element={<MyTimetables />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;