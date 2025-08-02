import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AllUsers from "./pages/AllUsers";
import Users from "./pages/Users";
import Workers from "./pages/Workers";
import Attendance from "./pages/AdminAttendance";
import ApproveLeave from "./pages/AdminLeaveApproval";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={["Admin", "HR"]} />} />
        <Route path="/employees" element={<ProtectedRoute element={<Employees />} allowedRoles={["Admin"]} />} />
        <Route path="/all-users" element={<ProtectedRoute element={<AllUsers />} allowedRoles={["Admin"]} />} />
        <Route path="/users" element={<ProtectedRoute element={<Users />} allowedRoles={["Admin"]} />} />
        <Route path="/workers" element={<ProtectedRoute element={<Workers />} allowedRoles={["Admin"]} />} />
        <Route path="/attendance" element={<ProtectedRoute element={<Attendance />} allowedRoles={["Admin", "HR"]} />} />
        <Route path="/approveleave" element={<ProtectedRoute element={<ApproveLeave />} allowedRoles={["Admin", "HR"]} />} />
      </Routes>
    </Router>
  );
};

export default App;
