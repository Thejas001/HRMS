import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WorkerDashboard.css";

interface Booking {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  workDescription: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  estimatedHours: number;
  specialRequirements: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const WorkerViewWork = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'request' | 'accepted' | 'completed' | 'rejected'>('request');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
        const worker = JSON.parse(localStorage.getItem("worker") || "{}");
      const token = localStorage.getItem("workerToken");
      
      if (!worker.id || !token) {
        setError('Worker not authenticated');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/bookings/worker/my-bookings`, {
          headers: {
          Authorization: `Bearer ${token}`,
          },
        });

      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch work requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const handleStatusUpdate = async (bookingId: number, newStatus: string, workerResponse?: string) => {
    try {
      const token = localStorage.getItem("workerToken");
      
      const response = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        status: newStatus,
        workerResponse: workerResponse
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        fetchBookings();
      }
    } catch (err: any) {
      console.error('Error updating booking status:', err);
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'request') return booking.status === 'pending';
    if (activeTab === 'accepted') return booking.status === 'accepted';
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'rejected') return booking.status === 'rejected';
    return true;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: 'Request', class: 'status-request', icon: '📋' },
      accepted: { text: 'Accepted', class: 'status-accepted', icon: '✅' },
      completed: { text: 'Completed', class: 'status-completed', icon: '🎉' },
      rejected: { text: 'Rejected', class: 'status-rejected', icon: '❌' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTabCount = (status: string) => {
    return bookings.filter(b => b.status === status).length;
  };

  if (loading) {
    return (
      <div className="worker-view-work-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Your Work Requests</h2>
          <p>Please wait while we fetch your latest work assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="worker-view-work-fullscreen">
      {/* Header Section */}
      <div className="work-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              onClick={() => navigate('/worker-dashboard')}
              className="back-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Back to Dashboard
            </button>
            <h1>My Work Requests</h1>
            <p>Manage and track all your work assignments</p>
          </div>
          <div className="header-right">
            <button 
              onClick={handleRefresh} 
              className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
              disabled={refreshing}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>{error}</span>
            <button onClick={() => setError('')} className="error-close">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'request' ? 'active' : ''}`}
          onClick={() => setActiveTab('request')}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-text">Requests</span>
          <span className="tab-count">{getTabCount('pending')}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'accepted' ? 'active' : ''}`}
          onClick={() => setActiveTab('accepted')}
        >
          <span className="tab-icon">✅</span>
          <span className="tab-text">Accepted</span>
          <span className="tab-count">{getTabCount('accepted')}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <span className="tab-icon">🎉</span>
          <span className="tab-text">Completed</span>
          <span className="tab-count">{getTabCount('completed')}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          <span className="tab-icon">❌</span>
          <span className="tab-text">Rejected</span>
          <span className="tab-count">{getTabCount('rejected')}</span>
        </button>
      </div>

      {/* Work Requests Content */}
      <div className="work-content">
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <div className="empty-icon">📋</div>
            </div>
            <h2>No {activeTab} work requests</h2>
            <p>
              {activeTab === 'request' && 'You have no pending work requests at the moment. New requests will appear here when customers book your services.'}
              {activeTab === 'accepted' && 'You have no accepted work requests. Accept some requests to see them here.'}
              {activeTab === 'completed' && 'You have no completed work requests. Mark accepted jobs as complete to see them here.'}
              {activeTab === 'rejected' && 'You have no rejected work requests. Rejected requests will appear here.'}
            </p>
            {activeTab === 'request' && (
              <button onClick={handleRefresh} className="empty-action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                Check for New Requests
              </button>
            )}
          </div>
        ) : (
          <div className="requests-grid">
            {filteredBookings.map((booking, index) => (
              <div 
                key={booking.id} 
                className="request-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {booking.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="customer-details">
                      <h3>{booking.customerName}</h3>
                      <p className="customer-contact">{booking.customerPhone}</p>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
                
                <div className="card-body">
                  <div className="work-description">
                    <h4>Work Description</h4>
                    <p>{booking.workDescription}</p>
                  </div>
                  
                  <div className="work-details-grid">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <div className="detail-content">
                          <label>Date</label>
                          <span>{formatDate(booking.preferredDate)}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🕒</span>
                        <div className="detail-content">
                          <label>Time</label>
                          <span>{booking.preferredTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-item full-width">
                        <span className="detail-icon">📍</span>
                        <div className="detail-content">
                          <label>Address</label>
                          <span>{booking.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-icon">📧</span>
                        <div className="detail-content">
                          <label>Email</label>
                          <span>{booking.customerEmail}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <div className="detail-content">
                          <label>Requested</label>
                          <span>{formatDate(booking.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.specialRequirements && (
                    <div className="special-requirements">
                      <h4>Special Requirements</h4>
                      <p>{booking.specialRequirements}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {booking.status === 'pending' && (
                  <div className="card-actions">
                    <button 
                      className="action-btn accept-btn"
                      onClick={() => handleStatusUpdate(booking.id, 'accepted')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      Accept Request
                    </button>
                    <button 
                      className="action-btn reject-btn"
                      onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                      Decline
                    </button>
                  </div>
                )}

                {booking.status === 'accepted' && (
                  <div className="card-actions">
                    <button 
                      className="action-btn complete-btn"
                      onClick={() => handleStatusUpdate(booking.id, 'completed')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.41 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      Mark Complete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerViewWork; 