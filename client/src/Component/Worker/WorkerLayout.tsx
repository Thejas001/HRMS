import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./WorkerDashboard.css";

const WorkerLayout = () => {
  const navigate = useNavigate();
  const [workerData, setWorkerData] = useState<any>(null);

  useEffect(() => {
    const storedWorker = localStorage.getItem("worker");
    if (!storedWorker) {
      navigate("/worker/login");
      return;
    }
    setWorkerData(JSON.parse(storedWorker));
  }, [navigate]);

  const sidebarItems =
    workerData?.applicationStatus === "accepted"
      ? [
          { label: "Post Work", path: "/worker/post-work" },
          { label: "My Job Posts", path: "/worker/my-job-posts" },
          { label: "View Work", path: "/worker/view-work" },
          { label: "Profile", path: "/worker/profile" },
        ]
      : [{ label: "Application Status", path: "/worker/dashboard" }];

  return (
    <div className="dashboard-container">
      <aside className="sidebar slide-in-left">
        <h2 className="sidebar-title">WorkHub</h2>
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.label}>
              <button onClick={() => navigate(item.path)}>{item.label}</button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="dashboard-content fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default WorkerLayout; 