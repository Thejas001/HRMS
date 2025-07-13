import { useEffect, useState } from 'react';
import axios from 'axios';
import './WorkersPage.css';

interface Worker {
  id: number;
  name: string;
  job: string;
  area: string;
  phone: string;
}

const WorkersPage = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [areaFilter, setAreaFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/employee');
        setWorkers(res.data);
        setFilteredWorkers(res.data);
      } catch (err) {
        console.error('Error fetching workers', err);
      }
    };
    fetchWorkers();
  }, []);

  const handleFilter = () => {
    const filtered = workers.filter(worker =>
      (areaFilter ? worker.area.toLowerCase().includes(areaFilter.toLowerCase()) : true) &&
      (jobFilter ? worker.job.toLowerCase().includes(jobFilter.toLowerCase()) : true)
    );
    setFilteredWorkers(filtered);
  };

  return (
    <div className="workers-container">
      <header className="workers-header">
        <div className="project-name">HRMS Project</div>
        <h1 className="animate-fade-in">Available Workers</h1>
      </header>

      <div className="filter-section animate-slide-up">
        <input
          type="text"
          placeholder="Filter by Area"
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Job"
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
        />
        <button onClick={handleFilter}>Apply Filters</button>
      </div>

      <div className="workers-grid">
        {filteredWorkers.map(worker => (
          <div key={worker.id} className="worker-card animate-fade-in-delay">
            <h2>{worker.name}</h2>
            <p><strong>Job:</strong> {worker.job}</p>
            <p><strong>Area:</strong> {worker.area}</p>
            <p><strong>Phone:</strong> {worker.phone}</p>
            <button className="book-btn">Book Worker</button>
          </div>
        ))}
      </div>

      <footer className="workers-footer">
        © {new Date().getFullYear()} WorkHub. All rights reserved.
      </footer>
    </div>
  );
};

export default WorkersPage;
