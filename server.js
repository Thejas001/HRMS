require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('./models'); // Sync models

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/employee', require('./routes/employee.routes'));
app.use('/api/leave', require('./routes/leave.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/workrequests', require('./routes/workrequest.routes'));
app.use('/api/jobposts', require('./routes/jobpost.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/admin', require('./routes/admin.routes'));


// After all your routes
app.use((req, res, next) => {
    res.status(404).json({
      message: 'Route not found',
      status: 404
    });
  });
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    });
  });
    
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log('🚀 Server running on port', PORT);
        
        await sequelize.sync({ alter: true }); // Ensure tables, including Booking, are synced
        console.log('✅ All models synced');        
      } catch (error) {
        console.error('❌ Server startup error:', error);
    }
});
