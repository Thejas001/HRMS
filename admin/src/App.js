import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Employee from "./pages/Employees"; // Import Employee Page
import EditProfile from "./pages/EditProfile";
import Attendance from "./pages/Attendance";
import AdminAttendance from "./pages/AdminAttendance";
import ApplyLeave from "./pages/ApplyLeave";
import AdminLeaveApproval from "./pages/AdminLeaveApproval";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/employees" element={<ProtectedRoute element={<Employee/>} />} /> {/* Employee Route */}
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/update/:id" element={<ProtectedRoute element={<EditProfile />} />} />
        <Route path="/adminattendance" element={<ProtectedRoute element={<AdminAttendance/>} />} />
        <Route path="/attendance" element={<ProtectedRoute element={<Attendance/>} />} />
        <Route path="/leave" element={<ProtectedRoute element={<ApplyLeave/>} />} />
        <Route path="/approveleave" element={<ProtectedRoute element={<AdminLeaveApproval/>} />} />
      </Routes>
    </Router>
  );
};

export default App;
