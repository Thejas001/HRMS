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

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isAvailable: boolean;
  isBooked: boolean;
  isPast: boolean;
}

const BookWorker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [customerBookings, setCustomerBookings] = useState<CustomerBooking[]>([]);
  const [showMyBookings, setShowMyBookings] = useState(false);

  // Mock availability data - in real app, this would come from API
  const [availability, setAvailability] = useState({
    availableDays: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31], // Days of month
    bookedDays: [6, 7, 13, 14, 20, 21, 27, 28], // Days of month
    workingHours: '9:00 AM - 6:00 PM'
  });

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
      // Fallback dummy worker data
      setWorker({
        id: 1,
        name: 'John Doe',
        age: 28,
        state: 'Chennai',
        mobileNumber: '9876543210',
        nationality: 'Indian',
        workExperience: 'Electrician with 5 years experience',
        profilePic: ''
      });
    }
    setLoading(false);
  }, [location.state]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, availability]);

  // Fetch worker availability
  useEffect(() => {
    if (worker?.id) {
      fetchWorkerAvailability();
    }
  }, [worker?.id, currentDate]);

  // Fetch customer bookings when email is entered
  useEffect(() => {
    if (formData.customerEmail && formData.customerEmail.includes('@')) {
      fetchCustomerBookings();
    }
  }, [formData.customerEmail]);

  const fetchWorkerAvailability = async () => {
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const response = await axios.get(`http://localhost:5000/api/bookings/availability/${worker?.id}/${month}/${year}`);
      
      if (response.data.success) {
        const availabilityData = response.data.data;
        
        // Convert booked dates to day numbers
        const bookedDays = availabilityData.bookedDates.map((date: string) => {
          return new Date(date).getDate();
        });
        
        // Convert accepted dates to day numbers (these are also booked)
        const acceptedDays = availabilityData.acceptedDates.map((date: string) => {
          return new Date(date).getDate();
        });
        
        // Generate available days (all days except booked and accepted ones)
        const allDays = Array.from({ length: 31 }, (_, i) => i + 1);
        const availableDays = allDays.filter(day => !bookedDays.includes(day) && !acceptedDays.includes(day));
        
        setAvailability({
          availableDays,
          bookedDays: [...bookedDays, ...acceptedDays], // Include both pending and accepted as booked
          workingHours: '9:00 AM - 6:00 PM'
        });
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Keep using mock data if API fails
    }
  };

  const fetchCustomerBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/customer/${encodeURIComponent(formData.customerEmail)}`);
      
      if (response.data.success) {
        setCustomerBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      // If no bookings found, that's okay
      setCustomerBookings([]);
    }
  };

  // Force input styling to override browser autofill
  useEffect(() => {
    const forceInputStyling = () => {
      const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
      inputs.forEach((input: any) => {
        input.style.backgroundColor = '#ffffff';
        input.style.color = '#000000';
        
        // Force focus and blur to trigger styling
        input.focus();
        input.blur();
      });
    };

    // Apply immediately
    forceInputStyling();
    
    // Apply after a short delay to catch autofill
    setTimeout(forceInputStyling, 100);
    setTimeout(forceInputStyling, 500);
    setTimeout(forceInputStyling, 1000);
  }, []);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayOfMonth = date.getDate();
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate ? date.toDateString() === selectedDate.toDateString() : false;
      const isPast = date < today;
      
      // For demo purposes, we'll use the mock data but only for future dates
      // In a real app, you'd fetch actual availability from the API
      const isAvailable = isCurrentMonth && !isPast && availability.availableDays.includes(dayOfMonth);
      const isBooked = isCurrentMonth && !isPast && availability.bookedDays.includes(dayOfMonth);
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        isAvailable,
        isBooked,
        isPast
      });
    }
    
    setCalendarDays(days);
  };

  const handleDateSelect = (day: CalendarDay) => {
    if (day.isCurrentMonth && day.isAvailable && !day.isBooked && !day.isPast) {
      setSelectedDate(day.date);
      setFormData(prev => ({
        ...prev,
        preferredDate: day.date.toISOString().split('T')[0]
      }));
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) return 'Customer name is required';
    if (!formData.customerEmail.trim()) return 'Customer email is required';
    if (!formData.customerPhone.trim()) return 'Customer phone is required';
    if (!formData.workType.trim()) return 'Work type is required';
    if (!formData.workDescription.trim()) return 'Work description is required';
    if (!formData.preferredDate) return 'Please select a preferred date';
    if (!formData.preferredTime) return 'Please select a preferred time';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.budget.trim()) return 'Budget is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const bookingData = {
        workerId: worker?.id,
        workerName: worker?.name,
        ...formData,
        preferredDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
        status: 'pending'
      };

      const response = await axios.post('http://localhost:5000/api/bookings/create', bookingData);
      
      if (response.data.success) {
        setSuccess('Booking request submitted successfully! We will contact you soon.');
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
        setSelectedDate(null);
        
        // Refresh customer bookings to show the new booking
        if (formData.customerEmail) {
          fetchCustomerBookings();
        }
      } else {
        setError(response.data.message || 'Failed to submit booking request');
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      if (err.code === 'ECONNREFUSED') {
        setError('Server is not running. This is a demo - booking would be submitted in production.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit booking request');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
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
      <div className="booking-loading">
        <p>Worker not found</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="booking-container">
      {/* Header */}
      <div className="booking-header">
        <button onClick={() => navigate('/')} className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Workers
        </button>
        <h1>Book Worker</h1>
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
              <span><strong>Age:</strong> {worker.age} years</span>
              <span><strong>Location:</strong> {worker.state}</span>
              <span><strong>Nationality:</strong> {worker.nationality}</span>
              <span><strong>Contact:</strong> {worker.mobileNumber}</span>
              <span><strong>Working Hours:</strong> {availability.workingHours}</span>
            </div>
          </div>
        </div>

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
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status === 'pending' ? 'Request Sent' : 
                         booking.status === 'accepted' ? 'Accepted' :
                         booking.status === 'rejected' ? 'Rejected' :
                         booking.status === 'completed' ? 'Completed' : booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Date:</strong> {new Date(booking.preferredDate).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {booking.preferredTime}</p>
                      {booking.employee && (
                        <p><strong>Worker:</strong> {booking.employee.firstName} {booking.employee.lastName}</p>
                      )}
                      <p><strong>Requested:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
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
            {/* Calendar Section */}
            <div className="form-section">
              <h4>Select Available Date</h4>
              <div className="calendar-container">
                <div className="calendar-header">
                  <button 
                    type="button" 
                    onClick={() => navigateMonth('prev')}
                    className="calendar-nav-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                  </button>
                  <h5>{getMonthName(currentDate)}</h5>
                  <button 
                    type="button" 
                    onClick={() => navigateMonth('next')}
                    className="calendar-nav-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                  </button>
                </div>
                
                <div className="calendar-grid">
                  {/* Day headers */}
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className="calendar-day-header">
                      {getDayName(i)}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {calendarDays.map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`calendar-day ${
                        !day.isCurrentMonth ? 'other-month' : ''
                      } ${day.isToday ? 'today' : ''} ${
                        day.isSelected ? 'selected' : ''
                      } ${day.isPast ? 'past' : ''} ${
                        day.isBooked ? 'booked' : ''
                      } ${day.isAvailable && !day.isPast ? 'available' : ''
                      }`}
                      onClick={() => handleDateSelect(day)}
                      disabled={!day.isCurrentMonth || day.isBooked || !day.isAvailable || day.isPast}
                    >
                      {day.date.getDate()}
                    </button>
                  ))}
                </div>
                
                <div className="calendar-legend">
                  <div className="legend-item">
                    <span className="legend-color available"></span>
                    <span>Available</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color booked"></span>
                    <span>Booked (Pending/Accepted)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color past"></span>
                    <span>Past</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color selected"></span>
                    <span>Selected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Selection */}
            <div className="form-section">
              <h4>Select Preferred Time</h4>
              <div className="form-group">
                <label htmlFor="preferredTime">Time Slot</label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a time slot</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                </select>
              </div>
            </div>

            {/* Customer Information */}
            <div className="form-section">
              <h4>Your Information</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="customerName">Full Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
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
                    placeholder="Enter your email"
                    required
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
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="urgency">Urgency Level</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Work Details */}
            <div className="form-section">
              <h4>Work Details</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="workType">Type of Work *</label>
                  <input
                    type="text"
                    id="workType"
                    name="workType"
                    value={formData.workType}
                    onChange={handleInputChange}
                    placeholder="e.g., Electrical repair, Plumbing, etc."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="budget">Budget Range *</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select budget range</option>
                    <option value="500-1000">₹500 - ₹1,000</option>
                    <option value="1000-2000">₹1,000 - ₹2,000</option>
                    <option value="2000-5000">₹2,000 - ₹5,000</option>
                    <option value="5000-10000">₹5,000 - ₹10,000</option>
                    <option value="10000+">₹10,000+</option>
                  </select>
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="workDescription">Work Description *</label>
                <textarea
                  id="workDescription"
                  name="workDescription"
                  value={formData.workDescription}
                  onChange={handleInputChange}
                  placeholder="Describe the work you need in detail..."
                  rows={4}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="address">Work Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter the complete address where work needs to be done"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
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
  );
};

export default BookWorker; 