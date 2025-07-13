import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './WorkerDashboard.css';

interface WorkRequest {
  _id: string;
  workerId: string;
  workerName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  workType: string;
  workDescription: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  budget: string;
  urgency: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  workerResponse?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Worker {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  workExperience: string;
  state: string;
}

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [responseText, setResponseText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchWorkerData();
    fetchWorkRequests();
  }, []);

    const fetchWorkerData = async () => {
      try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/worker/login');
          return;
        }

      const response = await axios.get('http://localhost:5000/api/employee/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWorker(response.data);
    } catch (error) {
      console.error('Error fetching worker data:', error);
      toast.error('Failed to load worker data');
    }
  };

  const fetchWorkRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`http://localhost:5000/api/bookings/worker/${worker?._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWorkRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching work requests:', error);
      toast.error('Failed to load work requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      setUpdating(bookingId);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          status,
          workerResponse: responseText[bookingId] || ''
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success(`Work request ${status} successfully`);
        fetchWorkRequests(); // Refresh the list
        setResponseText(prev => ({ ...prev, [bookingId]: '' }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update work request status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: 'Pending', class: 'status-pending' },
      accepted: { text: 'Accepted', class: 'status-accepted' },
      rejected: { text: 'Rejected', class: 'status-rejected' },
      completed: { text: 'Completed', class: 'status-completed' },
      cancelled: { text: 'Cancelled', class: 'status-cancelled' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      low: { text: 'Low', class: 'urgency-low' },
      normal: { text: 'Normal', class: 'urgency-normal' },
      high: { text: 'High', class: 'urgency-high' },
      urgent: { text: 'Urgent', class: 'urgency-urgent' }
    };
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.normal;
    return <span className={`urgency-badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/worker/login');
  };

  const pendingRequests = workRequests.filter(req => req.status === 'pending');
  const acceptedRequests = workRequests.filter(req => req.status === 'accepted');
  const completedRequests = workRequests.filter(req => req.status === 'completed');
  const rejectedRequests = workRequests.filter(req => req.status === 'rejected');

  if (loading) {
    return (
      <div className="worker-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="worker-dashboard">
      <ToastContainer />
      
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome back, {worker?.firstName}!</h1>
            <p className="subtitle">Manage your work requests and schedule</p>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/worker/post-work')} className="primary-button">
              Post New Work
            </button>
            <button onClick={handleLogout} className="secondary-button">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{pendingRequests.length}</h3>
          <p>Pending Requests</p>
        </div>
        <div className="stat-card">
          <h3>{acceptedRequests.length}</h3>
          <p>Accepted Jobs</p>
        </div>
        <div className="stat-card">
          <h3>{completedRequests.length}</h3>
          <p>Completed Jobs</p>
        </div>
        <div className="stat-card">
          <h3>{rejectedRequests.length}</h3>
          <p>Rejected Requests</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Work Requests ({pendingRequests.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'accepted' ? 'active' : ''}`}
          onClick={() => setActiveTab('accepted')}
        >
          Accepted Jobs ({acceptedRequests.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({completedRequests.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected ({rejectedRequests.length})
        </button>
      </div>

      {/* Work Requests List */}
      <div className="work-requests-container">
        {activeTab === 'requests' && (
          <div className="requests-section">
            <h2>Pending Work Requests</h2>
            {pendingRequests.length === 0 ? (
              <div className="empty-state">
                <p>No pending work requests</p>
              </div>
            ) : (
              <div className="requests-grid">
                {pendingRequests.map((request) => (
                  <div key={request._id} className="request-card">
                    <div className="request-header">
                      <h3>{request.workType}</h3>
                      <div className="request-badges">
                        {getStatusBadge(request.status)}
                        {getUrgencyBadge(request.urgency)}
                      </div>
                    </div>
                    
                    <div className="request-details">
                      <div className="detail-row">
                        <span className="label">Customer:</span>
                        <span>{request.customerName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Date:</span>
                        <span>{formatDate(request.preferredDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Time:</span>
                        <span>{formatTime(request.preferredTime)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Budget:</span>
                        <span>{request.budget}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Address:</span>
                        <span>{request.address}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Description:</span>
                        <span>{request.workDescription}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Contact:</span>
                        <span>{request.customerPhone}</span>
                      </div>
                    </div>

                    <div className="request-actions">
                      <textarea
                        placeholder="Add a response (optional)..."
                        value={responseText[request._id] || ''}
                        onChange={(e) => setResponseText(prev => ({
                          ...prev,
                          [request._id]: e.target.value
                        }))}
                        className="response-textarea"
                      />
                      <div className="action-buttons">
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'accepted')}
                          disabled={updating === request._id}
                          className="accept-button"
                        >
                          {updating === request._id ? 'Accepting...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'rejected')}
                          disabled={updating === request._id}
                          className="reject-button"
                        >
                          {updating === request._id ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'accepted' && (
          <div className="requests-section">
            <h2>Accepted Jobs</h2>
            {acceptedRequests.length === 0 ? (
              <div className="empty-state">
                <p>No accepted jobs</p>
              </div>
            ) : (
              <div className="requests-grid">
                {acceptedRequests.map((request) => (
                  <div key={request._id} className="request-card accepted">
                    <div className="request-header">
                      <h3>{request.workType}</h3>
                      <div className="request-badges">
                        {getStatusBadge(request.status)}
                        {getUrgencyBadge(request.urgency)}
                      </div>
                    </div>
                    
                    <div className="request-details">
                      <div className="detail-row">
                        <span className="label">Customer:</span>
                        <span>{request.customerName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Date:</span>
                        <span>{formatDate(request.preferredDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Time:</span>
                        <span>{formatTime(request.preferredTime)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Budget:</span>
                        <span>{request.budget}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Address:</span>
                        <span>{request.address}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Contact:</span>
                        <span>{request.customerPhone}</span>
                      </div>
                    </div>

                    <div className="request-actions">
      <button
                        onClick={() => handleStatusUpdate(request._id, 'completed')}
                        disabled={updating === request._id}
                        className="complete-button"
                      >
                        {updating === request._id ? 'Marking Complete...' : 'Mark as Complete'}
      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="requests-section">
            <h2>Completed Jobs</h2>
            {completedRequests.length === 0 ? (
              <div className="empty-state">
                <p>No completed jobs</p>
              </div>
            ) : (
              <div className="requests-grid">
                {completedRequests.map((request) => (
                  <div key={request._id} className="request-card completed">
                    <div className="request-header">
                      <h3>{request.workType}</h3>
                      <div className="request-badges">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    
                    <div className="request-details">
                      <div className="detail-row">
                        <span className="label">Customer:</span>
                        <span>{request.customerName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Date:</span>
                        <span>{formatDate(request.preferredDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Budget:</span>
                        <span>{request.budget}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Completed:</span>
                        <span>{formatDate(request.updatedAt || request.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'rejected' && (
          <div className="requests-section">
            <h2>Rejected Requests</h2>
            {rejectedRequests.length === 0 ? (
              <div className="empty-state">
                <p>No rejected requests</p>
              </div>
            ) : (
              <div className="requests-grid">
                {rejectedRequests.map((request) => (
                  <div key={request._id} className="request-card rejected">
                    <div className="request-header">
                      <h3>{request.workType}</h3>
                      <div className="request-badges">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    
                    <div className="request-details">
                      <div className="detail-row">
                        <span className="label">Customer:</span>
                        <span>{request.customerName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Date:</span>
                        <span>{formatDate(request.preferredDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Budget:</span>
                        <span>{request.budget}</span>
                      </div>
                      {request.workerResponse && (
                        <div className="detail-row">
                          <span className="label">Response:</span>
                          <span>{request.workerResponse}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
