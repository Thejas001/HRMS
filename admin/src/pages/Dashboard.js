import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import WorkOffIcon from "@mui/icons-material/WorkOff";
import SettingsIcon from "@mui/icons-material/Settings";
import WorkIcon from "@mui/icons-material/Work";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import GroupIcon from "@mui/icons-material/Group";
import Person from "@mui/icons-material/Person";
import Work from "@mui/icons-material/Work";

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const debug = {
      role: localStorage.getItem("role"),
      token: localStorage.getItem("token") ? "Present" : "Missing",
      userId: localStorage.getItem("userId"),
      username: localStorage.getItem("username"),
      timestamp: new Date().toLocaleString()
    };
    setDebugInfo(debug);
  }, []);

  const sections = [
    {
      title: "All Users",
      description: "View and manage all system users.",
      icon: <GroupIcon fontSize="large" />,
      route: "/all-users",
      allowedRoles: ["Admin"], // Only Admin can see this
    },
    {
      title: "Customer Management",
      description: "View and manage all customers.",
      icon: <Person fontSize="large" />,
      route: "/users",
      allowedRoles: ["Admin"], // Only Admin can see this
    },
    {
      title: "Worker Management",
      description: "View and manage all workers.",
      icon: <Work fontSize="large" />,
      route: "/workers",
      allowedRoles: ["Admin"], // Only Admin can see this
    },
    {
      title: "Manage Employees",
      description: "Add, edit, and remove employees.",
      icon: <PeopleIcon fontSize="large" />,
      route: "/employees",
      allowedRoles: ["Admin"], // Only Admin can see this
    },
    {
      title: "Worker Applications",
      description: "Review and manage worker applications.",
      icon: <Work fontSize="large" />,
      route: "/worker-applications",
      allowedRoles: ["Admin", "HR"], // Admin & HR can see this
    },
    {
      title: "Attendance Tracking",
      description: "Monitor employee attendance.",
      icon: <EventAvailableIcon fontSize="large" />,
      route: "/attendance",
      allowedRoles: ["Admin", "HR"], // Admin & HR can see this
    },
    {
      title: "Leave Requests",
      description: "Review and approve leave requests.",
      icon: <WorkOffIcon fontSize="large" />,
      route: "/approveleave",
      allowedRoles: ["Admin", "HR"], // Admin & HR can see this
    },
    {
      title: "Reports & Analytics",
      description: "Generate detailed reports.",
      icon: <AssessmentIcon fontSize="large" />,
      route: "/analytics",
      allowedRoles: ["Admin", "HR"], // Admin & HR can see this
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings.",
      icon: <SettingsIcon fontSize="large" />,
      route: "/settings",
      allowedRoles: ["Admin"], // Only Admin can see this
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F8F9FA" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <TopBar />
        
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Executive Admin Dashboard
        </Typography>

        {/* Grid Layout for Action Cards */}
        <Grid container spacing={3}>
          {sections
            .filter((section) => section.allowedRoles.includes(userRole)) // Only show allowed sections
            .map((section, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    boxShadow: 3,
                    transition: "0.3s",
                    "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(section.route)}
                >
                  <Box
                    sx={{
                      fontSize: 50,
                      color: "#7B68EE",
                      mr: 2,
                    }}
                  >
                    {section.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {section.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray", mb: 1 }}>
                      {section.description}
                    </Typography>
                  </CardContent>
                  <IconButton>
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
