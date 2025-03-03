import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { Logout, Home } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/dashboard");
  };

  // Mapping routes to readable names
  const routeNames = {
    "/dashboard": "Dashboard",
    "/profile": "Profile",
    "/approveleave": "Leave Requests",
    "/employees": "Employees",
    "/attendance": "My Attendance",
    "/adminattendance": "Approve Attendance",
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(135deg, #1C1C3C, #292950)",
        color: "#FFFFFF",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Home Button */}
        <IconButton onClick={handleHome} sx={{ color: "#FFD700", "&:hover": { transform: "scale(1.1)" } }}>
          <Home fontSize="large" />
        </IconButton>

        {/* Page Title */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            fontWeight: "bold",
            letterSpacing: 1,
            textTransform: "uppercase",
            transition: "0.3s ease-in-out",
          }}
        >
          {routeNames[location.pathname] || "Admin Panel"}
        </Typography>

        {/* Logout Button */}
        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#FFFFFF",
            borderColor: "#FFD700",
            "&:hover": { backgroundColor: "#FFD700", color: "#1C1C3C" },
          }}
          startIcon={<Logout />}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
