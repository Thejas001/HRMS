import { useEffect, useState } from "react";
import "./JobPostDisplay.css";

type JobPost = {
  id: number;
  category: string;
  description: string;
  ratePerHour?: number;
  ratePerDay?: number;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const JobPostDisplay = () => {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all"); // all, active, inactive

  useEffect(() => {
    fetchJobPosts();
  }, []);

  const fetchJobPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("workerToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("http://localhost:5000/api/jobposts/my-posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch job posts");
      }

      const data = await response.json();
      setJobPosts(data.jobPosts || data);
    } catch (err: any) {
      setError(err.message || "Failed to load job posts");
      setJobPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      default:
        return "status-default";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      Plumbing: "🔧",
      Electrical: "⚡",
      Carpentry: "🔨",
      Cleaning: "🧹",
      Painting: "🎨",
      Gardening: "🌱",
      Moving: "📦",
      Construction: "🏗️",
      Maintenance: "🔧",
      Other: "📋"
    };
    return icons[category] || "📋";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredJobPosts = jobPosts.filter(post => {
    if (filter === "all") return true;
    return post.status.toLowerCase() === filter;
  });

  const handleStatusToggle = async (jobId: number, currentStatus: string) => {
    try {
      const token = localStorage.getItem("workerToken");
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      const response = await fetch(`http://localhost:5000/api/jobpost/${jobId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setJobPosts(prev => 
        prev.map(post => 
          post.id === jobId 
            ? { ...post, status: newStatus }
            : post
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="job-posts-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your job posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-posts-dashboard">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="nav-left">
          <h1>My Job Posts</h1>
          <div className="nav-stats">
            <span className="stat-item">
              <strong>{jobPosts.length}</strong> Total
            </span>
            <span className="stat-item">
              <strong>{jobPosts.filter(p => p.status === "active").length}</strong> Active
            </span>
            <span className="stat-item">
              <strong>{jobPosts.filter(p => p.status === "inactive").length}</strong> Paused
            </span>
          </div>
        </div>
        <div className="nav-right">
          <button className="refresh-btn" onClick={fetchJobPosts}>
            <span className="btn-icon">🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-tabs">
          <button 
            className={`action-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            <span className="tab-icon">📋</span>
            All Posts
          </button>
          <button 
            className={`action-tab ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            <span className="tab-icon">✅</span>
            Active
          </button>
          <button 
            className={`action-tab ${filter === "inactive" ? "active" : ""}`}
            onClick={() => setFilter("inactive")}
          >
            <span className="tab-icon">⏸️</span>
            Paused
          </button>
        </div>
        <div className="search-container">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search your job posts..." 
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
          <button className="retry-btn" onClick={fetchJobPosts}>
            Try Again
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {filteredJobPosts.length === 0 ? (
          <div className="empty-container">
            <div className="empty-illustration">
              <div className="empty-icon">📝</div>
              <div className="empty-lines">
                <div className="line"></div>
                <div className="line short"></div>
                <div className="line"></div>
              </div>
            </div>
            <h2>No job posts found</h2>
            <p>
              {filter === "all" 
                ? "Ready to find great workers? Create your first job post!"
                : `No ${filter} job posts found.`
              }
            </p>
          </div>
        ) : (
          <div className="posts-container">
            {filteredJobPosts.map((jobPost) => (
              <div key={jobPost.id} className={`post-card ${jobPost.status === "active" ? "active" : ""}`}>
                <div className="post-header">
                  <div className="post-meta">
                    <div className="category-tag">
                      <span className="category-emoji">{getCategoryIcon(jobPost.category)}</span>
                      {jobPost.category}
                    </div>
                    <div className={`status-indicator ${getStatusColor(jobPost.status)}`}>
                      <span className="status-dot"></span>
                      {jobPost.status}
                    </div>
                  </div>
                  <div className="post-actions">
                    <button className="action-btn edit">
                      <span>✏️</span>
                    </button>
                    <button 
                      className={`action-btn toggle ${jobPost.status === "active" ? "pause" : "play"}`}
                      onClick={() => handleStatusToggle(jobPost.id, jobPost.status)}
                    >
                      <span>{jobPost.status === "active" ? "⏸️" : "▶️"}</span>
                    </button>
                  </div>
                </div>

                <div className="post-body">
                  <p className="post-description">
                    {jobPost.description.length > 120 
                      ? `${jobPost.description.substring(0, 120)}...` 
                      : jobPost.description
                    }
                  </p>
                  
                  <div className="post-info">
                    <div className="info-row">
                      <span className="info-label">📍</span>
                      <span className="info-value">{jobPost.location}</span>
                    </div>
                    
                    <div className="pricing-row">
                      {jobPost.ratePerHour && (
                        <div className="price-tag hourly">
                          <span className="price-label">Hourly</span>
                          <span className="price-value">₹{jobPost.ratePerHour}</span>
                        </div>
                      )}
                      {jobPost.ratePerDay && (
                        <div className="price-tag daily">
                          <span className="price-label">Daily</span>
                          <span className="price-value">₹{jobPost.ratePerDay}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="post-footer">
                  <span className="post-date">
                    Posted {formatDate(jobPost.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostDisplay; 