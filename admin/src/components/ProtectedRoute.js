import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/dashboard" />;

  return element;
};

export default ProtectedRoute; 