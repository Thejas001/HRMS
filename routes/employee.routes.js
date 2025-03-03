
const express = require('express');
const { addEmployee, getAllEmployees, updateEmployee, deleteEmployee, getEmployeeByUserId } = require('../controllers/employee.controller');
const authMiddleware = require('../middleware/authMiddleware');
const authRole = require('../middleware/authRole');

const router = express.Router();


router.get('/:userId', authMiddleware, getEmployeeByUserId);
router.get('/', authMiddleware, getAllEmployees);
router.put('/update/:id', authMiddleware,authRole(["Admin", "HR","Employee"]), updateEmployee);
router.delete('/delete/:id', authMiddleware,authRole(["Admin"]), deleteEmployee);

module.exports = router;

