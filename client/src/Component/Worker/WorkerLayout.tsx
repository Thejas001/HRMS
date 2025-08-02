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

  const handleLogout = () => {
    // Clear all worker-related data from localStorage
    localStorage.removeItem("worker");
    localStorage.removeItem("workerToken");
    
    // Redirect to login page
    navigate("/worker/login");
  };

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
        
        {/* Logout Section */}
        <div className="logout-section">
          <div className="worker-info">
            <div className="worker-avatar">
              {workerData?.name ? workerData.name.charAt(0).toUpperCase() : 'W'}
            </div>
            <div className="worker-details">
              <p className="worker-name">{workerData?.name || "Worker"}</p>
              <p className="worker-email">{workerData?.email || ""}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>
      <main className="dashboard-content fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default WorkerLayout; 