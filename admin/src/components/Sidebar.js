// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Box,
//   Typography,
//   Divider,
// } from "@mui/material";
// import { Link, useLocation } from "react-router-dom";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import PeopleIcon from "@mui/icons-material/People";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import FactCheckIcon from "@mui/icons-material/FactCheck";

// const Sidebar = () => {
//   const location = useLocation(); // Get current route
//   const [selected, setSelected] = useState(location.pathname);
//   const [role, setRole] = useState(""); // Store user role

//   useEffect(() => {
//     const userRole = localStorage.getItem("role"); // Get role from localStorage
//     setRole(userRole);
//   }, []);

//   // Define all menu items
//   const menuItems = [
//     {
//       text: "Dashboard",
//       icon: <DashboardIcon />,
//       path: "/dashboard",
//       roles: ["Admin", "HR", "Employee"],
//     },
//     {
//       text: "Profile",
//       icon: <AccountCircleIcon />,
//       path: "/profile",
//       roles: ["Admin", "HR", "Employee"],
//     },
//     {
//       text: "Employees",
//       icon: <PeopleIcon />,
//       path: "/employees",
//       roles: ["Admin", "HR"],
//     },
//     {
//       text: "My Attendance",
//       icon: <FactCheckIcon />,
//       path: "/attendance",
//       roles: ["Employee", "HR"],
//     },
//     {
//       text: "Approve Attendance",
//       icon: <CheckCircleIcon />,
//       path: "/adminattendance",
//       roles: ["HR", "Admin"],
//     },
//     {
//       text: "Apply Leave",
//       icon: <CalendarTodayIcon />,
//       path: "/leave",
//       roles: ["Employee"],
//     },
//     {
//       text: "Leave Approvals",
//       icon: <CheckCircleIcon />,
//       path: "/approveleave",
//       roles: ["HR"],
//     },
//   ];

//   // Filter menu items based on user role
//   const filteredMenu = menuItems.filter((item) => item.roles.includes(role));

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: 250,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: 250,
//           background: "linear-gradient(135deg, #1f1f3a, #11112b)",
//           color: "#FFFFFF",
//           borderRight: "3px solid #444",
//         },
//       }}
//     >
//       {/* Sidebar Header */}
//       <Box
//         sx={{
//           textAlign: "center",
//           py: 3,
//           background: "linear-gradient(135deg, #292950, #1b1b3a)",
//         }}
//       >
//         <Typography
//           variant="h5"
//           sx={{ fontWeight: "bold", color: "#FFD700", letterSpacing: 1 }}
//         >
//           {role} Panel
//         </Typography>
//       </Box>

//       <Divider sx={{ backgroundColor: "#555", mx: 2 }} />

//       {/* Menu List */}
//       <List sx={{ py: 1 }}>
//         {filteredMenu.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton
//               component={Link}
//               to={item.path}
//               selected={selected === item.path}
//               onClick={() => setSelected(item.path)}
//               sx={{
//                 m: 1,
//                 py: 1.5,
//                 borderRadius: 2,
//                 color: selected === item.path ? "#FFD700" : "#FFFFFF",
//                 backgroundColor:
//                   selected === item.path ? "#333357" : "transparent",
//                 transition: "all 0.3s ease-in-out",
//                 "&:hover": {
//                   backgroundColor: "#3A3A55",
//                   transform: "scale(1.05)",
//                 },
//                 "&.Mui-selected": {
//                   backgroundColor: "#444467",
//                   color: "#FFD700",
//                   "& .MuiListItemIcon-root": { color: "#FFD700" },
//                 },
//               }}
//             >
//               <ListItemIcon
//                 sx={{ color: selected === item.path ? "#FFD700" : "#FFFFFF" }}
//               >
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText
//                 primary={item.text}
//                 sx={{ fontWeight: "bold", letterSpacing: 0.5 }}
//               />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;
import React, { useState, useEffect } from "react";
import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Box, Typography, Divider, AppBar, Toolbar, BottomNavigation, BottomNavigationAction 
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MenuIcon from "@mui/icons-material/Menu";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";


const Sidebar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const [role, setRole] = useState(""); 
  const [userName, setUserName] = useState("");
  const [workTitle, setWorkTitle] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem("role") || "User");
    setUserName(localStorage.getItem("username") || "John Doe");
    setWorkTitle(localStorage.getItem("workTitle") || "Software Engineer");
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard", roles: ["Admin", "HR", "Employee"] },
    { text: "Profile", icon: <AccountCircleIcon />, path: "/profile", roles: ["Admin", "HR", "Employee"] },
    { text: "Employees", icon: <PeopleIcon />, path: "/employees", roles: ["Admin", "HR"] },
    { text: "My Attendance", icon: <FactCheckIcon />, path: "/attendance", roles: ["Employee", "HR"] },
    { text: "Approve Attendance", icon: <CheckCircleIcon />, path: "/adminattendance", roles: ["HR", "Admin"] },
    { text: "Apply Leave", icon: <CalendarTodayIcon />, path: "/leave", roles: ["Employee"] },
    { text: "Leave Approvals", icon: <CheckCircleIcon />, path: "/approveleave", roles: ["HR"] },
    { text: "Worker Applications", icon: <WorkOutlineIcon />, path: "/worker-applications", roles: ["Admin", "HR"] },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(role));

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        background: "linear-gradient(135deg, #1f1f3a, #11112b)",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box sx={{ textAlign: "center", py: 3, background: "linear-gradient(135deg, #292950, #1b1b3a)" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FFD700", letterSpacing: 1 }}>
            {role} Panel
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: "#555", mx: 2 }} />
        <List sx={{ py: 1 }}>
          {filteredMenu.map((item) => (
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
      </Box>
      
      {/* Bottom Section */}
      <Box sx={{ textAlign: "center", py: 2, borderTop: "1px solid #555", background: "#222240" }}>
        <Typography variant="subtitle1" sx={{ color: "#FFD700", fontWeight: "bold" }}>
          {userName}
        </Typography>
        <Typography variant="body2" sx={{ color: "#BBBBBB" }}>
          {workTitle}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* AppBar for Mobile */}
      <AppBar position="fixed" sx={{ display: { md: "none" }, background: "#1f1f3a" }}>
        <Toolbar>
          <MenuIcon onClick={handleDrawerToggle} sx={{ cursor: "pointer", color: "#FFD700", fontSize: 28 }} />
          <Typography variant="h6" sx={{ ml: 2, flexGrow: 1, color: "#FFFFFF" }}>
            {role} Panel
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar for Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: 250,
            borderRight: "3px solid #444",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Sidebar for Mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 250 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: { xs: "flex", md: "none" },
          background: "#1f1f3a",
        }}
        value={selected}
        onChange={(event, newValue) => setSelected(newValue)}
      >
        {filteredMenu.slice(0, 4).map((item) => (
          <BottomNavigationAction
            key={item.text}
            label={item.text}
            icon={item.icon}
            component={Link}
            to={item.path}
            sx={{
              color: selected === item.path ? "#FFD700" : "#FFFFFF",
              "&.Mui-selected": { color: "#FFD700" },
            }}
          />
        ))}
      </BottomNavigation>
    </>
  );
};

export default Sidebar;
