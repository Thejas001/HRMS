import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookWorker.css';

interface Worker {
  id: number;
  name: string;
  age: number;
  state: string;
  mobileNumber: string;
  nationality: string;
  workExperience: string;
  profilePic?: string;
}

interface BookingForm {
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
}

interface CustomerBooking {
  id: number;
  workerName: string;
  workDescription: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  createdAt: string;
  employee?: {
    firstName: string;
    lastName: string;
    workExperience: string;
  };
}

const BookWorker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customerBookings, setCustomerBookings] = useState<CustomerBooking[]>([]);
  const [showMyBookings, setShowMyBookings] = useState(false);

  const [formData, setFormData] = useState<BookingForm>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    workType: '',
    workDescription: '',
    preferredDate: '',
    preferredTime: '',
    address: '',
    budget: '',
    urgency: 'normal'
  });

  useEffect(() => {
    if (location.state?.worker) {
      setWorker(location.state.worker);
    } else {
      setWorker(null);
    }
    setLoading(false);
  }, [location.state]);

  useEffect(() => {
    if (worker) {
      fetchCustomerBookings();
    }
  }, [worker]);

  const fetchCustomerBookings = async () => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/bookings/customer/${encodeURIComponent(formData.customerEmail)}`);
      
      if (response.data.success) {
        setCustomerBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || 
        !formData.workDescription || !formData.preferredDate || !formData.preferredTime || 
        !formData.address) {
      setError('Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      
      const bookingData = {
        employeeId: worker?.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        workDescription: formData.workDescription,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        address: formData.address,
        specialRequirements: formData.budget,
        estimatedHours: 1 // Default to 1 hour
      };

      const response = await axios.post('http://localhost:5000/api/bookings/create', bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess('Booking request submitted successfully! The worker will review your request.');
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          workType: '',
          workDescription: '',
          preferredDate: '',
          preferredTime: '',
          address: '',
          budget: '',
          urgency: 'normal'
        });
        
        // Refresh bookings
        setTimeout(() => {
          fetchCustomerBookings();
        }, 1000);
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.message || 'Failed to submit booking request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: 'Pending', class: 'status-pending' },
      accepted: { text: 'Accepted', class: 'status-accepted' },
      rejected: { text: 'Rejected', class: 'status-rejected' },
      completed: { text: 'Completed', class: 'status-completed' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="booking-loading">
        <div className="booking-spinner"></div>
        <p>Loading worker details...</p>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="booking-error">
        <h2>Worker Not Found</h2>
        <p>Unable to load worker details. Please try again.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="booking-container">
      {/* Header with Profile and Logout Buttons */}
      <div className="neo-header">
        <div className="neo-header-content">
          <h1 className="neo-logo">WorkHub</h1>
          <div className="neo-header-buttons">
            <button 
              onClick={() => navigate('/profile')}
              className="neo-profile-btn"
              title="View My Profile"
            >
              <svg className="neo-profile-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              My Profile
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="neo-logout-btn"
              title="Back to Dashboard"
            >
              <svg className="neo-logout-icon" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="booking-content">
        {/* Worker Details Card */}
        <div className="worker-details-card">
          <div className="worker-avatar">
            {worker.profilePic ? (
              <img src={worker.profilePic} alt={worker.name} />
            ) : (
              <div className="worker-avatar-placeholder">
                {worker.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <div className="worker-info">
            <h2>{worker.name}</h2>
            <p className="worker-experience">{worker.workExperience}</p>
            <div className="worker-details">
              <div className="detail-item">
                <span className="label">Age:</span>
                <span className="value">{worker.age} years</span>
              </div>
              <div className="detail-item">
                <span className="label">Location:</span>
                <span className="value">{worker.state}</span>
              </div>
              <div className="detail-item">
                <span className="label">Nationality:</span>
                <span className="value">{worker.nationality}</span>
              </div>
              <div className="detail-item">
                <span className="label">Contact:</span>
                <span className="value">{worker.mobileNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Customer Bookings Section */}
          {customerBookings.length > 0 && (
            <div className="customer-bookings-section">
              <div className="section-header">
                <h3>My Work Requests</h3>
                <button 
                  type="button" 
                  onClick={() => setShowMyBookings(!showMyBookings)}
                  className="toggle-btn"
                >
                  {showMyBookings ? 'Hide' : 'Show'} My Requests
                </button>
              </div>
              
              {showMyBookings && (
                <div className="bookings-list">
                  {customerBookings.map((booking) => (
                    <div key={booking.id} className={`booking-card ${booking.status}`}>
                      <div className="booking-header">
                        <h4>{booking.workDescription}</h4>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="booking-details">
                        <div className="detail-row">
                          <span className="label">Date:</span>
                          <span className="value">{new Date(booking.preferredDate).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Time:</span>
                          <span className="value">{booking.preferredTime}</span>
                        </div>
                        {booking.employee && (
                          <div className="detail-row">
                            <span className="label">Worker:</span>
                            <span className="value">{booking.employee.firstName} {booking.employee.lastName}</span>
                          </div>
                        )}
                        <div className="detail-row">
                          <span className="label">Requested:</span>
                          <span className="value">{new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {booking.status === 'accepted' && (
                        <div className="accepted-notice">
                          <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                          <span>Your work request has been accepted! The worker will contact you soon.</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Booking Form */}
          <div className="booking-form-container">
            <h3>Schedule Your Work</h3>
            
            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {error}
              </div>
            )}
            
            {success && (
              <div className="success-message">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="customerName">Your Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail">Email *</label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerPhone">Phone Number *</label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="preferredDate">Preferred Date *</label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="preferredTime">Preferred Time *</label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Work Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter the complete work address"
                    rows={3}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="workDescription">Work Description *</label>
                  <textarea
                    id="workDescription"
                    name="workDescription"
                    value={formData.workDescription}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe the work you need done"
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="budget">Budget Range</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                  >
                    <option value="">Select budget range</option>
                    <option value="500-1000">₹500 - ₹1,000</option>
                    <option value="1000-2000">₹1,000 - ₹2,000</option>
                    <option value="2000-5000">₹2,000 - ₹5,000</option>
                    <option value="5000+">₹5,000+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="urgency">Urgency Level</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="very-urgent">Very Urgent</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Booking Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookWorker; 