import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './WorkerDashboard.css';
import WorkerCalendar from './WorkerCalendar';

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
  _id?: string;
  id?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  workExperience: string;
  state: string;
  applicationStatus?: string;
}

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [responseText, setResponseText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchWorkerData();
    fetchWorkRequests();
    
    // Set up periodic status check every 30 seconds
    const statusCheckInterval = setInterval(() => {
      if (worker?.applicationStatus === 'pending') {
        checkApplicationStatus();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(statusCheckInterval);
  }, [worker?.applicationStatus]);

  // Show success message if application is approved (first time loading)
  useEffect(() => {
    if (worker?.applicationStatus === 'accepted') {
      toast.success('🎉 Welcome! Your application has been approved. You have access to all features.');
    }
  }, [worker?.applicationStatus]);

  // Auto-check status when component mounts if status is pending
  useEffect(() => {
    if (worker?.applicationStatus === 'pending') {
      // Check status immediately when component loads
      setTimeout(() => {
        checkApplicationStatus();
      }, 2000); // Check after 2 seconds
    }
  }, [worker?.applicationStatus]);

      const fetchWorkerData = async () => {
    try {
      const token = localStorage.getItem('workerToken');
      if (!token) {
        navigate('/worker/login');
        return;
      }

      // Get worker data from localStorage first
      const storedWorker = localStorage.getItem('worker');
      if (storedWorker) {
        const workerData = JSON.parse(storedWorker);
        console.log('Stored worker data:', workerData);
        setWorker(workerData);
      }

      // Also fetch from API to get latest data
      try {
        const response = await axios.get('http://localhost:5000/api/employee/status', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('API status response:', response.data);

        // Update worker data with latest application status
        if (storedWorker) {
          const workerData = JSON.parse(storedWorker);
          const previousStatus = workerData.applicationStatus;
          const newStatus = response.data.applicationStatus;
          
          console.log('Status comparison:', { previousStatus, newStatus });
          
          const updatedWorker = {
            ...workerData,
            applicationStatus: newStatus
          };
          setWorker(updatedWorker);
          // Update localStorage with latest status
          localStorage.setItem('worker', JSON.stringify(updatedWorker));
          

          
          // Show notification if status changed
          if (previousStatus !== newStatus) {
            if (newStatus === 'accepted') {
              toast.success('🎉 Congratulations! Your application has been approved! You now have access to all features.');
              // Refresh work requests after approval
              setTimeout(() => {
                fetchWorkRequests();
              }, 2000);
            } else if (newStatus === 'rejected') {
              toast.error('Your application has been rejected. Please contact admin for more information.');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching employee status:', error);
        // Don't show error toast for status fetch, just use stored data
      }
    } catch (error) {
      console.error('Error fetching worker data:', error);
      toast.error('Failed to load worker data');
    }
  };

  const checkApplicationStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('workerToken');
      if (!token) {
        navigate('/worker/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/employee/status', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const storedWorker = localStorage.getItem('worker');
      if (storedWorker) {
        const workerData = JSON.parse(storedWorker);
        const previousStatus = workerData.applicationStatus;
        const newStatus = response.data.applicationStatus;
        
        const updatedWorker = {
          ...workerData,
          applicationStatus: newStatus
        };
        setWorker(updatedWorker);
        localStorage.setItem('worker', JSON.stringify(updatedWorker));
        
        // Show notification if status changed
        if (previousStatus !== newStatus) {
          if (newStatus === 'accepted') {
            toast.success('🎉 Congratulations! Your application has been approved! You now have access to all features.');
            // Refresh work requests after approval
            setTimeout(() => {
              fetchWorkRequests();
            }, 2000);
          } else if (newStatus === 'rejected') {
            toast.error('Your application has been rejected. Please contact admin for more information.');
          }
        } else {
          toast.info('Application status is still the same. No changes detected.');
        }
      }
    } catch (error) {
      console.error('Error checking application status:', error);
      toast.error('Failed to check application status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkRequests = async () => {
    try {
      const token = localStorage.getItem('workerToken');
      if (!token) return;

      // Only fetch work requests if application is approved
      if (worker?.applicationStatus !== 'accepted') {
        setLoading(false);
        return;
      }

      // Use the correct worker ID - try different possible fields
      const workerId = worker?._id || worker?.id || worker?.userId;
      if (!workerId) {
        console.error('No worker ID found');
        return;
      }
      
      const response = await axios.get(`http://localhost:5000/api/bookings/worker/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWorkRequests(response.data.data || []);
      
      // Get employee ID from the first booking if available
      if (response.data.data && response.data.data.length > 0) {
        const firstBooking = response.data.data[0];
        if (firstBooking.employeeId) {
          setEmployeeId(firstBooking.employeeId.toString());
        }
      }
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
      const token = localStorage.getItem('workerToken');
      
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
        
        // Show notification if accepted
        if (status === 'accepted' && response.data.data?.customerNotification) {
          toast.info(`Customer has been notified of acceptance!`);
        }
        
        // Force calendar refresh if on calendar tab
        if (activeTab === 'calendar') {
          // Trigger calendar refresh by changing the key
          setActiveTab('requests');
          setTimeout(() => setActiveTab('calendar'), 100);
        }
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
    localStorage.removeItem('workerToken');
    localStorage.removeItem('worker');
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

  // Show pending application status if not approved
  if (worker?.applicationStatus === 'pending') {
    return (
      <div className="worker-dashboard">
        <ToastContainer />
        
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>Welcome back, {worker?.firstName}!</h1>
              <p className="subtitle">Your application is under review</p>
            </div>
            <div className="header-actions">
              <button onClick={handleLogout} className="secondary-button">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Application Status Card */}
        <div className="application-status-container">
          <div className="status-card pending">
            <div className="status-icon">⏳</div>
            <h2>Application Status: Pending</h2>
            <p>Your application is currently under review by our admin team.</p>
            <p>You will be able to access all dashboard features once your application is approved.</p>
            <div className="status-details">
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Admin will review your application and documents</li>
                <li>You'll receive notification once approved</li>
                <li>You'll then have access to work requests and job postings</li>
              </ul>
            </div>
            <div className="refresh-section">
              <button 
                onClick={checkApplicationStatus} 
                className="refresh-button"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Check Application Status'}
              </button>
              <p className="refresh-hint">Click to check if your application has been approved</p>
              <p className="refresh-hint" style={{ color: '#ff6b35', fontWeight: 'bold' }}>
                💡 Tip: Your status will also be checked automatically every 30 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show rejected application status
  if (worker?.applicationStatus === 'rejected') {
    return (
      <div className="worker-dashboard">
        <ToastContainer />
        
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1>Welcome back, {worker?.firstName}!</h1>
              <p className="subtitle">Application Status</p>
            </div>
            <div className="header-actions">
              <button onClick={handleLogout} className="secondary-button">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Application Status Card */}
        <div className="application-status-container">
          <div className="status-card rejected">
            <div className="status-icon">❌</div>
            <h2>Application Status: Rejected</h2>
            <p>Unfortunately, your application has been rejected.</p>
            <p>Please contact the admin team for more information.</p>
            <div className="status-details">
              <p><strong>Next steps:</strong></p>
              <ul>
                <li>Contact admin for clarification</li>
                <li>You may reapply with updated information</li>
                <li>Ensure all documents are properly uploaded</li>
              </ul>
            </div>
            <div className="refresh-section">
              <button 
                onClick={checkApplicationStatus} 
                className="refresh-button"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Check Application Status'}
              </button>
              <p className="refresh-hint">Click to check if your application status has changed</p>
            </div>
          </div>
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
        <button 
          className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar
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

        {activeTab === 'calendar' && (
          <div className="requests-section">
            <h2>My Schedule</h2>
            <p className="calendar-description">
              View your booked dates and availability. Green dates are accepted bookings, 
              blue dates are pending requests.
            </p>
            <WorkerCalendar workerId={employeeId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
