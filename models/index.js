const sequelize = require('../config/db');
const User = require('./user.model');
const Employee = require('./employee.model');
const Attendance = require('./attendance.model');
const LeaveRequest = require('./leaveRequest.model');
const Payroll = require('./payroll.model');

// Sync database
sequelize.sync({ alter: true })
    .then(() => console.log('✅ Tables synced!'))
    .catch(err => console.error('❌ Sync error:', err));
User.hasMany(Employee, { foreignKey: 'addedBy' });
Employee.belongsTo(User, { foreignKey: 'addedBy' });
module.exports = { User, Employee, Attendance, LeaveRequest, Payroll };

