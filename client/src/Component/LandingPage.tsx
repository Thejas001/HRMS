import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';

interface Worker {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  age: number;
  address: string;
  state: string;
  mobileNumber: string;
  nationality: string;
  workExperience: string;
  workType?: string;
  applicationStatus: 'pending' | 'accepted' | 'rejected';
  profilePic?: string;
  createdAt: string;
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

const LandingPage = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workTypeFilter, setWorkTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [customerBookings, setCustomerBookings] = useState<CustomerBooking[]>([]);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  // Available work types
  const workTypes = [
    'Electrician',
    'Plumber',
    'Painter',
    'Carpenter',
    'Gardener',
    'Cleaner',
    'Mason',
    'Welder',
    'Mechanic',
    'Driver',
    'Cook',
    'Security Guard',
    'Other'
  ];

  useEffect(() => {
    fetchWorkers();
    fetchCustomerBookings();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('http://localhost:5000/api/employee/public', {
        timeout: 5000 // 5 second timeout
      });
      
      if (response.data && Array.isArray(response.data)) {
        const workersData = response.data.map((worker: any) => ({
          id: worker.id,
          firstName: worker.firstName || '',
          middleName: worker.middleName || '',
          lastName: worker.lastName || '',
          age: worker.age || 0,
          address: worker.address || '',
          state: worker.state || '',
          mobileNumber: worker.mobileNumber || '',
          nationality: worker.nationality || '',
          workExperience: worker.workExperience || '',
          workType: worker.workType || '',
          applicationStatus: worker.applicationStatus || 'accepted',
          profilePic: worker.profilePic || '',
          createdAt: worker.createdAt || new Date().toISOString()
        }));
        setWorkers(workersData);
        setFilteredWorkers(workersData);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err: any) {
      console.error('Error fetching workers:', err);
      // Show error state instead of dummy data
      setWorkers([]);
      setFilteredWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerBookings = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
      if (userEmail) {
        const response = await axios.get(`http://localhost:5000/api/bookings/customer/${encodeURIComponent(userEmail)}`);
        
        if (response.data.success) {
          const bookings = response.data.data;
          setCustomerBookings(bookings);
          
          // Count pending bookings
          const pendingCount = bookings.filter((booking: CustomerBooking) => booking.status === 'pending').length;
          setPendingBookingsCount(pendingCount);
        }
      }
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
    }
  };

  useEffect(() => {
    let filtered = workers;

    // Filter by search term (improved search)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(worker => {
        const fullName = `${worker.firstName} ${worker.middleName || ''} ${worker.lastName}`.toLowerCase();
        const state = worker.state.toLowerCase();
        const experience = worker.workExperience.toLowerCase();
        const nationality = worker.nationality.toLowerCase();
        const workType = (worker.workType || '').toLowerCase();
        
        return fullName.includes(searchLower) ||
               state.includes(searchLower) ||
               experience.includes(searchLower) ||
               nationality.includes(searchLower) ||
               workType.includes(searchLower) ||
               worker.mobileNumber.includes(searchTerm);
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(worker => worker.applicationStatus === statusFilter);
    }

    // Filter by work type
    if (workTypeFilter !== 'all') {
      filtered = filtered.filter(worker => worker.workType === workTypeFilter);
    }

    // Sort workers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'age':
          return a.age - b.age;
        case 'experience':
          return a.workExperience.localeCompare(b.workExperience);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredWorkers(filtered);
  }, [workers, searchTerm, statusFilter, workTypeFilter, sortBy]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      accepted: { text: 'Available', class: 'status-accepted' },
      pending: { text: 'Pending', class: 'status-pending' },
      rejected: { text: 'Unavailable', class: 'status-rejected' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.accepted;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getFullName = (worker: Worker) => {
    return `${worker.firstName} ${worker.middleName ? worker.middleName + ' ' : ''}${worker.lastName}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleBookWorker = (worker: Worker) => {
    // Navigate to booking page with worker data
    navigate('/book-worker', { 
      state: { 
        worker: {
          id: worker.id,
          name: getFullName(worker),
          age: worker.age,
          state: worker.state,
          mobileNumber: worker.mobileNumber,
          nationality: worker.nationality,
          workExperience: worker.workExperience,
          workType: worker.workType,
          profilePic: worker.profilePic
        }
      }
    });
  };

  const handleLogout = () => {
    // Clear user data from localStorage/sessionStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userToken');
    
    // Navigate to login page
    navigate('/');
  };

  if (loading) {
    return (
      <div className="neo-loading-container">
        <div className="neo-loading-spinner"></div>
        <p className="neo-loading-text">Loading talented workers...</p>
      </div>
    );
  }

  return (
    <div className="neo-container">
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
              {pendingBookingsCount > 0 && (
                <span className="neo-badge">{pendingBookingsCount}</span>
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="neo-logout-btn"
              title="Logout"
            >
              <svg className="neo-logout-icon" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="neo-hero">
        <div className="neo-hero-content">
          <h1 className="neo-hero-title">
            <span className="neo-gradient-text">Find Your Perfect</span>
            <br />
            <span className="neo-hero-subtitle">Skilled Worker</span>
          </h1>
          <p className="neo-hero-description">
            Connect with verified professionals across various domains. 
            Quality work, reliable service, exceptional results.
          </p>

          <div className="neo-services-simple-header">
          <h2 className="neo-services-simple-title">Our Services</h2>
        </div>
        <div className="neo-services-simple-grid">
          <div className="neo-service-simple-card">
            <div className="neo-service-simple-icon electrician">
              <svg viewBox="0 0 24 24">
                <path d="M7 2v11h3v9l7-12h-4l4-8z" fill="#ff6b35"/>
              </svg>
            </div>
            <span className="neo-service-simple-name">Electrician</span>
          </div>
          <div className="neo-service-simple-card">
            <div className="neo-service-simple-icon plumber">
              <svg viewBox="0 0 24 24">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="#8b5cf6"/>
              </svg>
            </div>
            <span className="neo-service-simple-name">Plumber</span>
          </div>
          <div className="neo-service-simple-card">
            <div className="neo-service-simple-icon painter">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#ec4899"/>
              </svg>
            </div>
            <span className="neo-service-simple-name">Painter</span>
          </div>
          <div className="neo-service-simple-card">
            <div className="neo-service-simple-icon carpenter">
              <svg viewBox="0 0 24 24">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="#a0522d"/>
              </svg>
            </div>
            <span className="neo-service-simple-name">Carpenter</span>
          </div>
          <div className="neo-service-simple-card">
            <div className="neo-service-simple-icon gardener">
              <svg viewBox="0 0 24 24">
                <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 2.12 13.38 1 12 1S9.5 2.12 9.5 3.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5z" fill="#22c55e"/>
              </svg>
            </div>
            <span className="neo-service-simple-name">Gardener</span>
          </div>
          <div className="neo-service-simple-card">
            <div className="neo-service-simple-icon cleaner">
              <svg viewBox="0 0 24 24">
                <path d="M19.36 2.72l1.42 1.42-5.46 5.46 1.42 1.42 5.46-5.46 1.42 1.42L18.36 2.72c-.55-.55-1.45-.55-2 0zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" fill="#ff6b35"/>
              </svg>
            </div>
            <span className="neo-service-simple-name">Cleaner</span>
          </div>
        </div>
        </div>

      </section>
      {/* Search and Filter Section */}
      <section className="neo-filters">
        <div className="neo-search-container">
          <div className="neo-search-box">
            <svg className="neo-search-icon" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, location, work type, skills, or phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="neo-search-input"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="neo-clear-search"
                title="Clear search"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="neo-filter-controls">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="neo-select"
            >
              <option value="all">All Workers</option>
              <option value="accepted">Available</option>
            </select>
            
            <select
              value={workTypeFilter}
              onChange={(e) => setWorkTypeFilter(e.target.value)}
              className="neo-select"
            >
              <option value="all">All Work Types</option>
              {workTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="neo-select"
            >
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
              <option value="experience">Sort by Experience</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>
      </section>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="neo-search-results">
          <p>Found {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? 's' : ''} matching "{searchTerm}"</p>
        </div>
      )}

      {/* Workers Grid */}
      <section className="neo-workers-grid">
        {filteredWorkers.length === 0 ? (
          <div className="neo-empty-state">
            <div className="neo-empty-icon">👥</div>
            <h3>No workers found</h3>
            <p>
              {searchTerm 
                ? `No workers match "${searchTerm}". Try different keywords or clear the search.`
                : 'No workers available at the moment. Please check back later.'
              }
            </p>
            {searchTerm && (
              <button onClick={clearSearch} className="neo-btn neo-btn-primary">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredWorkers.map((worker, index) => (
            <div 
              key={worker.id} 
              className="neo-worker-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="neo-card-header">
                <div className="neo-avatar">
                  {worker.profilePic ? (
                    <img src={worker.profilePic} alt={getFullName(worker)} />
                  ) : (
                    <div className="neo-avatar-placeholder">
                      {worker.firstName.charAt(0)}{worker.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="neo-card-title">
                  <h3>{getFullName(worker)}</h3>
                  <div className="neo-card-badges">
                    {getStatusBadge(worker.applicationStatus)}
                    {worker.workType && (
                      <span className="neo-work-type-badge">
                        {worker.workType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="neo-card-body">
                {worker.workType && (
                  <div className="neo-info-row">
                    <span className="neo-info-label">Work Type:</span>
                    <span className="neo-info-value">{worker.workType}</span>
                  </div>
                )}
                <div className="neo-info-row">
                  <span className="neo-info-label">Age:</span>
                  <span className="neo-info-value">{worker.age} years</span>
                </div>
                <div className="neo-info-row">
                  <span className="neo-info-label">Location:</span>
                  <span className="neo-info-value">{worker.state}</span>
                </div>
                <div className="neo-info-row">
                  <span className="neo-info-label">Experience:</span>
                  <span className="neo-info-value">{worker.workExperience}</span>
                </div>
                <div className="neo-info-row">
                  <span className="neo-info-label">Nationality:</span>
                  <span className="neo-info-value">{worker.nationality}</span>
                </div>
                <div className="neo-info-row">
                  <span className="neo-info-label">Contact:</span>
                  <span className="neo-info-value">{worker.mobileNumber}</span>
                </div>
                <div className="neo-info-row">
                  <span className="neo-info-label">Joined:</span>
                  <span className="neo-info-value">{formatDate(worker.createdAt)}</span>
                </div>
              </div>
              
              <div className="neo-card-actions">
                <button 
                  className="neo-btn neo-btn-primary"
                  onClick={() => handleBookWorker(worker)}
                >
                  <svg className="neo-btn-icon" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                  </svg>
                  Book Worker
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Footer */}
      <footer className="neo-footer">
        <div className="neo-footer-content">
          <p>&copy; {new Date().getFullYear()} WorkHub. Connecting talent with opportunity.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
