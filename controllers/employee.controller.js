const { Employee } = require('../models');


exports.getEmployeeByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const employee = await Employee.findOne({ where: { userId } });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error });
    }
};
// Get all employees (Only HR/Admin)
exports.getAllEmployees = async (req, res) => {
    try {
        console.log("User from token:", req.user); // Debugging

        if (!req.user || (!req.user.role || (req.user.role !== 'Admin' && req.user.role !== 'Hr'))) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error });
    }
};


// Update employee details (Only HR/Admin)
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { position, department, salary, joiningDate } = req.body;

        // ✅ Validate and format the joiningDate
        let formattedDate = null;
        if (joiningDate) {
            const dateObj = new Date(joiningDate);
            if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
            } else {
                return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
            }
        }

        // ✅ Update employee
        const updatedEmployee = await Employee.update(
            {
                position,
                department,
                salary,
                joiningDate: formattedDate
            },
            { where: { id } }
        );

        if (updatedEmployee[0] === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating employee", error });
    }
};


// Delete an employee (Only Admin)
exports.deleteEmployee = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        await employee.destroy();
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
};

