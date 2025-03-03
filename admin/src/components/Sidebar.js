import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FactCheckIcon from "@mui/icons-material/FactCheck";

const Sidebar = () => {
  const location = useLocation(); // Get current route
  const [selected, setSelected] = useState(location.pathname);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Profile", icon: <AccountCircleIcon />, path: "/profile" },
    { text: "Leave Request", icon: <CalendarTodayIcon />, path: "/approveleave" },
    { text: "Employees", icon: <PeopleIcon />, path: "/employees" },
    { text: "My Attendance", icon: <FactCheckIcon />, path: "/attendance" },
    { text: "Approve Attendance", icon: <CheckCircleIcon />, path: "/adminattendance" },
    { text: "Leave Approvals", icon: <CheckCircleIcon />, path: "/approveleave" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 250,
          background: "linear-gradient(135deg, #1f1f3a, #11112b)",
          color: "#FFFFFF",
          borderRight: "3px solid #444",
        },
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ textAlign: "center", py: 3, background: "linear-gradient(135deg, #292950, #1b1b3a)" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFD700", letterSpacing: 1 }}>
          Admin Panel
        </Typography>
      </Box>

      <Divider sx={{ backgroundColor: "#555", mx: 2 }} />

      {/* Menu List */}
      <List sx={{ py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={selected === item.path}
              onClick={() => setSelected(item.path)}
              sx={{
                m: 1,
                py: 1.5,
                borderRadius: 2,
                color: selected === item.path ? "#FFD700" : "#FFFFFF",
                backgroundColor: selected === item.path ? "#333357" : "transparent",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#3A3A55",
                  transform: "scale(1.05)",
                },
                "&.Mui-selected": {
                  backgroundColor: "#444467",
                  color: "#FFD700",
                  "& .MuiListItemIcon-root": { color: "#FFD700" },
                },
              }}
            >
              <ListItemIcon sx={{ color: selected === item.path ? "#FFD700" : "#FFFFFF" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ fontWeight: "bold", letterSpacing: 0.5 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
