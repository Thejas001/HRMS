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
  applicationStatus: 'pending' | 'accepted' | 'rejected';
  profilePic?: string;
  createdAt: string;
}

// Fallback dummy data for testing
const dummyWorkers: Worker[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    address: '123 Main Street',
    state: 'Chennai',
    mobileNumber: '9876543210',
    nationality: 'Indian',
    workExperience: 'Electrician with 5 years experience',
    applicationStatus: 'accepted',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    firstName: 'Alice',
    lastName: 'Smith',
    age: 32,
    address: '456 Oak Avenue',
    state: 'Chengalpattu',
    mobileNumber: '9876543211',
    nationality: 'Indian',
    workExperience: 'Plumber with 8 years experience',
    applicationStatus: 'accepted',
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    age: 25,
    address: '789 Pine Road',
    state: 'Tambaram',
    mobileNumber: '9876543212',
    nationality: 'Indian',
    workExperience: 'Carpenter with 3 years experience',
    applicationStatus: 'accepted',
    createdAt: '2024-01-20'
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Wilson',
    age: 29,
    address: '321 Elm Street',
    state: 'Chennai',
    mobileNumber: '9876543213',
    nationality: 'Indian',
    workExperience: 'Electrician with 6 years experience',
    applicationStatus: 'accepted',
    createdAt: '2024-01-12'
  },
  {
    id: 5,
    firstName: 'Mike',
    lastName: 'Brown',
    age: 35,
    address: '654 Maple Drive',
    state: 'Chengalpattu',
    mobileNumber: '9876543214',
    nationality: 'Indian',
    workExperience: 'Plumber with 10 years experience',
    applicationStatus: 'accepted',
    createdAt: '2024-01-08'
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [useDummyData, setUseDummyData] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError('');
      
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
          applicationStatus: worker.applicationStatus || 'accepted',
          profilePic: worker.profilePic || '',
          createdAt: worker.createdAt || new Date().toISOString()
        }));
        setWorkers(workersData);
        setFilteredWorkers(workersData);
        setUseDummyData(false);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err: any) {
      console.error('Error fetching workers:', err);
      
      // If API fails, use dummy data for demonstration
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('API server is not running. Using demo data instead.');
        setWorkers(dummyWorkers);
        setFilteredWorkers(dummyWorkers);
        setUseDummyData(true);
      } else {
        setError('Failed to load workers. Using demo data instead.');
        setWorkers(dummyWorkers);
        setFilteredWorkers(dummyWorkers);
        setUseDummyData(true);
      }
    } finally {
      setLoading(false);
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
        
        return fullName.includes(searchLower) ||
               state.includes(searchLower) ||
               experience.includes(searchLower) ||
               nationality.includes(searchLower) ||
               worker.mobileNumber.includes(searchTerm);
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(worker => worker.applicationStatus === statusFilter);
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
  }, [workers, searchTerm, statusFilter, sortBy]);

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
          profilePic: worker.profilePic
        }
      }
    });
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
        </div>
        <div className="neo-hero-stats">
          <div className="neo-stat">
            <span className="neo-stat-number">{workers.length}</span>
            <span className="neo-stat-label">Available Workers</span>
          </div>
          <div className="neo-stat">
            <span className="neo-stat-number">
              {workers.filter(w => w.workExperience.toLowerCase().includes('electrician') || w.workExperience.toLowerCase().includes('electrical')).length}
            </span>
            <span className="neo-stat-label">Electricians</span>
          </div>
          <div className="neo-stat">
            <span className="neo-stat-number">
              {workers.filter(w => w.workExperience.toLowerCase().includes('plumber') || w.workExperience.toLowerCase().includes('plumbing')).length}
            </span>
            <span className="neo-stat-label">Plumbers</span>
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
              placeholder="Search by name, location, skills, or phone..."
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

      {/* Error/Demo Data Banner */}
      {error && (
        <div className="neo-error-banner">
          <svg className="neo-error-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          {error}
          {useDummyData && (
            <button onClick={fetchWorkers} className="neo-retry-btn">
              Retry API
            </button>
          )}
        </div>
      )}

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
                  {getStatusBadge(worker.applicationStatus)}
                </div>
              </div>
              
              <div className="neo-card-body">
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
                <button className="neo-btn neo-btn-secondary">
                  <svg className="neo-btn-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  View Profile
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
