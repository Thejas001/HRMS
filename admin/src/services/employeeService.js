import axios from "axios";

const API_URL = "http://localhost:5000/api/employees"; // Update based on your backend
const USER="http://localhost:5000/api/users";
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Get all employees (Admin, HR, ReportingManager only)
export const getAllEmployees = async () => {
  return axios.get(API_URL, getAuthHeaders());
};

// Get employee by userId
export const getEmployeeByUserId = async (userId) => {
  return axios.get(`${API_URL}/${userId}`, getAuthHeaders());
};

// Update employee details (Admin, HR, ReportingManager only)
export const updateEmployee = async (id, employeeData) => {
  return axios.put(`${API_URL}/update/${id}`, employeeData, getAuthHeaders());
};

// Delete an employee (Only Admin)
export const deleteEmployee = async (id) => {
  return axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
};

export const registerEmployee = async (employeeData) => {
  return axios.post(`${USER}/register`, employeeData, {
    headers: { "Content-Type": "application/json" },
  });
};