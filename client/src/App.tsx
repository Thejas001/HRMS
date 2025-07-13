import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLogin from './Component/Customer/UserLogin';
import UserRegister from './Component/Customer/UserRegister';
import LandingPage from './Component/LandingPage';
import WorkersPage from './Component/Customer/WorkersPage';
import BookWorker from './Component/Customer/BookWorker';
import WorkerLogin from './Component/Worker/WorkerLogin';
import WorkerRegister from './Component/Worker/WorkerRegister';
import WorkerDashboard from "./Component/Worker/WorkerDashboard";
import WorkerPostWork from "./Component/Worker/WorkerPostWork";
import WorkerViewWork from "./Component/Worker/WorkerViewWork";
import WorkerProfile from "./Component/Worker/WorkerProfile";
import WorkerLayout from "./Component/Worker/WorkerLayout";
import JobPostDisplay from "./Component/Worker/JobPostDisplay";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/dashboard" element={<LandingPage />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/workers" element={<WorkersPage />} />
        <Route path="/book-worker" element={<BookWorker />} />
        <Route path="/worker/login" element={<WorkerLogin />} />
        <Route path="/worker/register" element={<WorkerRegister />} />
        <Route path="/worker" element={<WorkerLayout />}>
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="post-work" element={<WorkerPostWork />} />
          <Route path="my-job-posts" element={<JobPostDisplay />} />
          <Route path="view-work" element={<WorkerViewWork />} />
          <Route path="profile" element={<WorkerProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
