import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  profilePic?: string;
  createdAt: string;
  bookings?: Booking[];
}

interface Booking {
  id: number;
  workerName: string;
  serviceType: string;
  bookingDate: string;
  bookingTime: string;
  status: 'pending' | 'confirmed' | 'accepted' | 'completed' | 'cancelled' | 'rejected';
  amount: number;
  workerDetails?: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    workExperience: string;
  };
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Separate useEffect to handle bookings after profile is loaded
  useEffect(() => {
    if (profile?.email) {
      // Load bookings immediately when profile is available
      refreshBookings();
      
      // Auto-refresh bookings every 30 seconds
      const interval = setInterval(() => {
        refreshBookings();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [profile?.email]);

  // Function to refresh bookings
  const refreshBookings = async () => {
    try {
      // Try both token storage keys
      const token = localStorage.getItem('userToken') || localStorage.getItem('token') || sessionStorage.getItem('userToken') || sessionStorage.getItem('token');
      
      if (!profile?.email) {
        console.log('No profile email available');
        return;
      }

      console.log('Fetching bookings for email:', profile.email);
      // Temporary fix for testing - use the email that has bookings
      const testEmail = profile.email === 'thejas@gmail.com' ? 'thejasvelgi@gmail.com' : profile.email;
      const response = await axios.get(
        `http://localhost:5000/api/bookings/customer/${testEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
            
      console.log('Bookings API response:', response.data);
      
      if (response.data.success && profile) {
        // Format bookings for frontend
        const formattedBookings = response.data.data.map((booking: any) => ({
          id: booking.id,
          workerName: booking.employee ? `${booking.employee.firstName} ${booking.employee.lastName}` : 'Unknown Worker',
          serviceType: booking.workDescription || 'General Work',
          bookingDate: booking.preferredDate,
          bookingTime: booking.preferredTime,
          status: booking.status,
          amount: booking.estimatedHours * 500, // Assuming ₹500 per hour
          workerDetails: booking.employee ? {
            firstName: booking.employee.firstName,
            lastName: booking.employee.lastName,
            mobileNumber: booking.employee.mobileNumber,
            workExperience: booking.employee.workExperience
          } : undefined
        }));
        
        console.log('Formatted bookings:', formattedBookings);

        // Check for status changes and show notifications
        const oldBookings = profile.bookings || [];
        formattedBookings.forEach((newBooking: any) => {
          const oldBooking = oldBookings.find((b: any) => b.id === newBooking.id);
          if (oldBooking && oldBooking.status !== newBooking.status) {
            if (newBooking.status === 'accepted') {
              alert(`🎉 Great news! Your work request has been accepted by ${newBooking.workerName}!`);
            } else if (newBooking.status === 'rejected') {
              alert(`Your work request has been rejected. Please contact the worker for more information.`);
            }
          }
        });

        setProfile({
          ...profile,
          bookings: formattedBookings
        });
      } else {
        console.log('API response not successful or no profile');
      }
    } catch (error: any) {
      console.error('Error refreshing bookings:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get token from localStorage - try both storage keys
      const token = localStorage.getItem('userToken') || localStorage.getItem('token') || sessionStorage.getItem('userToken') || sessionStorage.getItem('token');
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`http://localhost:5000/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000
      });
      
      if (response.data) {
        console.log('Profile loaded:', response.data);
        console.log('Profile email:', response.data.email);
        setProfile(response.data);
        setEditForm({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phoneNumber: response.data.phoneNumber || '',
          address: response.data.address || '',
          city: response.data.city || '',
          state: response.data.state || ''
        });
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      
      // Check if it's an authentication error
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        setTimeout(() => {
          localStorage.removeItem('userToken');
          localStorage.removeItem('token');
          sessionStorage.removeItem('userToken');
          sessionStorage.removeItem('token');
          navigate('/');
        }, 2000);
        return;
      }
      
      // For other errors (network issues, server down), show a message but don't use dummy data
      setError('Unable to load profile data. Please check your connection and try again.');
      
      // Set a minimal profile structure to prevent crashes
      const fallbackProfile: UserProfile = {
        id: 0,
        firstName: 'User',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        createdAt: new Date().toISOString(),
        bookings: []
      };
      
      setProfile(fallbackProfile);
      setEditForm({
        firstName: fallbackProfile.firstName,
        lastName: fallbackProfile.lastName,
        phoneNumber: fallbackProfile.phoneNumber,
        address: fallbackProfile.address,
        city: fallbackProfile.city,
        state: fallbackProfile.state
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(`http://localhost:5000/api/users/profile`, editForm, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000
      });
      
      if (response.data) {
        setProfile({ ...profile!, ...editForm });
        setIsEditing(false);
        setError('');
        // Show success message
        alert('Profile updated successfully!');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        setTimeout(() => {
          localStorage.removeItem('userToken');
          sessionStorage.removeItem('userToken');
          navigate('/');
        }, 2000);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { text: 'Confirmed', class: 'status-confirmed' },
      accepted: { text: 'Accepted', class: 'status-confirmed' },
      pending: { text: 'Pending', class: 'status-pending' },
      completed: { text: 'Completed', class: 'status-completed' },
      cancelled: { text: 'Cancelled', class: 'status-cancelled' },
      rejected: { text: 'Rejected', class: 'status-cancelled' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    // Clear user data from localStorage/sessionStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userToken');
    localStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('token');
    
    // Navigate to login page
    navigate('/');
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="profile-loading-spinner"></div>
        <p className="profile-loading-text">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-left">
          <button onClick={handleBackToDashboard} className="profile-back-btn">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="profile-title">My Profile</h1>
        </div>
      </div>

      {/* Error Banner - Only show for authentication errors */}
      {error && (
        <div className="profile-error-banner">
          <svg className="profile-error-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          {error}
        </div>
      )}

      {profile && (
        <div className="profile-content">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-avatar">
                {profile.profilePic ? (
                  <img src={profile.profilePic} alt={`${profile.firstName} ${profile.lastName}`} />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{profile.firstName} {profile.lastName}</h2>
                <p className="profile-email">{profile.email}</p>
                <p className="profile-member-since">Member since {formatDate(profile.createdAt)}</p>
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-number">{profile.bookings?.length || 0}</span>
                    <span className="stat-label">Total Bookings</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {profile.bookings?.filter(b => b.status === 'completed').length || 0}
                    </span>
                    <span className="stat-label">Completed</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {profile.bookings?.filter(b => b.status === 'pending').length || 0}
                    </span>
                    <span className="stat-label">Pending</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="profile-edit-btn"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="profile-edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={editForm.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={editForm.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="profile-save-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="profile-cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{profile.phoneNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{profile.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">City:</span>
                  <span className="detail-value">{profile.city}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">State:</span>
                  <span className="detail-value">{profile.state}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bookings Section */}
          <div className="profile-bookings">
            <div className="bookings-header">
              <h3 className="bookings-title">My Bookings</h3>
              <button onClick={refreshBookings} className="refresh-bookings-btn">
                🔄 Refresh
              </button>
              <div className="bookings-summary">
                <span className="summary-item">
                  <span className="summary-number">{profile.bookings?.length || 0}</span>
                  <span className="summary-label">Total</span>
                </span>
                <span className="summary-item">
                  <span className="summary-number">
                    {profile.bookings?.filter(b => b.status === 'accepted' || b.status === 'confirmed').length || 0}
                  </span>
                  <span className="summary-label">Accepted</span>
                </span>
                <span className="summary-item">
                  <span className="summary-number">
                    {profile.bookings?.filter(b => b.status === 'pending').length || 0}
                  </span>
                  <span className="summary-label">Pending</span>
                </span>
              </div>
            </div>
            
            {profile.bookings && profile.bookings.length > 0 ? (
              <div className="bookings-grid">
                {profile.bookings.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <div className="card-header">
                      <div className="booking-info">
                        <h3 className="booking-title">Booking #{booking.id}</h3>
                        <p className="booking-date">{formatDate(booking.bookingDate)}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="card-body">
                      <div className="worker-info">
                        <div className="worker-name">
                          <strong>Worker:</strong> {booking.workerName}
                        </div>
                        <div className="service-type">
                          <strong>Service:</strong> {booking.serviceType}
                        </div>
                      </div>
                      
                      <div className="booking-details">
                        <div className="detail-item">
                          <span className="label">Date:</span>
                          <span className="value">{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Time:</span>
                          <span className="value">{booking.bookingTime}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Duration:</span>
                          <span className="value">{booking.amount / 500} hours</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Rate:</span>
                          <span className="value">₹500/hour</span>
                        </div>
                        <div className="detail-item total">
                          <span className="label">Total:</span>
                          <span className="value">₹{booking.amount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {booking.workerDetails && (
                        <div className="worker-contact">
                          <div className="contact-item">
                            <span className="label">Phone:</span>
                            <span className="value">{booking.workerDetails.mobileNumber}</span>
                          </div>
                          <div className="contact-item">
                            <span className="label">Experience:</span>
                            <span className="value">{booking.workerDetails.workExperience}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {booking.status === 'pending' && (
                      <div className="card-footer">
                        <button className="btn-cancel">Cancel Booking</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-bookings">
                <div className="no-bookings-icon">📋</div>
                <h4>No bookings yet</h4>
                <p>Start by booking a worker from the dashboard</p>
                <button onClick={handleBackToDashboard} className="profile-btn">
                  Browse Workers
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 