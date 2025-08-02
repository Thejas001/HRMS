import { useState, useEffect } from 'react';
import axios from 'axios';
import './WorkerCalendar.css';

interface CalendarDate {
  date: string;
  isBooked: boolean;
  isPending: boolean;
  isAccepted: boolean;
  booking?: any;
}

interface WorkerCalendarProps {
  workerId: string;
}

const WorkerCalendar = ({ workerId }: WorkerCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate, workerId]);

  const fetchCalendarData = async () => {
    if (!workerId) return;
    
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const response = await axios.get(`http://localhost:5000/api/bookings/availability/${workerId}/${month}/${year}`);
      
      if (response.data.success) {
        const availability = response.data.data;
        generateCalendarDates(availability);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarDates = (availability: any) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const dates: CalendarDate[] = [];
    const current = new Date(startDate);

    while (current <= lastDay || dates.length < 42) {
      const dateString = current.toISOString().split('T')[0];
      const isBooked = availability.bookedDates?.includes(dateString) || false;
      const isPending = availability.pendingDates?.includes(dateString) || false;
      const isAccepted = availability.acceptedDates?.includes(dateString) || false;

      dates.push({
        date: dateString,
        isBooked,
        isPending,
        isAccepted
      });

      current.setDate(current.getDate() + 1);
    }

    setCalendarDates(dates);
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDateClass = (date: CalendarDate) => {
    const classes = ['calendar-date'];
    
    if (date.isAccepted) {
      classes.push('booked-accepted');
    } else if (date.isPending) {
      classes.push('booked-pending');
    } else if (date.isBooked) {
      classes.push('booked');
    }
    
    return classes.join(' ');
  };

  const getDateTooltip = (date: CalendarDate) => {
    if (date.isAccepted) return 'Accepted Booking';
    if (date.isPending) return 'Pending Booking';
    if (date.isBooked) return 'Booked';
    return 'Available';
  };

  return (
    <div className="worker-calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth('prev')} className="calendar-nav-btn">
          ‹
        </button>
        <h3 className="calendar-title">{getMonthName(currentDate)}</h3>
        <button onClick={() => navigateMonth('next')} className="calendar-nav-btn">
          ›
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          <div className="weekday">Sun</div>
          <div className="weekday">Mon</div>
          <div className="weekday">Tue</div>
          <div className="weekday">Wed</div>
          <div className="weekday">Thu</div>
          <div className="weekday">Fri</div>
          <div className="weekday">Sat</div>
        </div>

        <div className="calendar-dates">
          {loading ? (
            <div className="calendar-loading">Loading...</div>
          ) : (
            calendarDates.map((date, index) => (
              <div
                key={index}
                className={getDateClass(date)}
                title={getDateTooltip(date)}
              >
                {new Date(date.date).getDate()}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color pending"></div>
          <span>Pending</span>
        </div>
        <div className="legend-item">
          <div className="legend-color accepted"></div>
          <span>Accepted</span>
        </div>
      </div>
    </div>
  );
};

export default WorkerCalendar; 