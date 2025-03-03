require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('./models'); // Sync models

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/employees', require('./routes/employee.routes'));
app.use('/api/leave', require('./routes/leave.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log('🚀 Server running on port', PORT);
    } catch (error) {
        console.error('❌ Server startup error:', error);
    }
});
