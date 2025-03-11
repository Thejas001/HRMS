// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/AppBar";
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   IconButton,
// } from "@mui/material";
// import PeopleIcon from "@mui/icons-material/People";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import GroupIcon from "@mui/icons-material/Group";
// import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// import WorkOffIcon from "@mui/icons-material/WorkOff";
// import SettingsIcon from "@mui/icons-material/Settings";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import AttendanceTracker from "../components/AttendanceTracker";
// const Dashboard = () => {
//   const navigate = useNavigate();

//   const sections = [
//     {
//       title: "Manage Employees",
//       description: "Add, edit, and remove employees.",
//       icon: <PeopleIcon fontSize="large" />,
//       route: "/employees",
//     },

//     {
//       title: "Attendance Tracking",
//       description: "Monitor employee attendance.",
//       icon: <EventAvailableIcon fontSize="large" />,
//       route: "/attendance",
//     },
//     {
//       title: "Leave Requests",
//       description: "Review and approve leave requests.",
//       icon: <WorkOffIcon fontSize="large" />,
//       route: "/approveleave",
//     },
//     {
//       title: "Reports & Analytics",
//       description: "Generate detailed reports.",
//       icon: <AssessmentIcon fontSize="large" />,
//       route: "/analytics",
//     },
//     {
//       title: "System Settings",
//       description: "Configure system-wide settings.",
//       icon: <SettingsIcon fontSize="large" />,
//       route: "/settings",
//     },
//   ];

//   return (
//     <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F8F9FA" }}>
//       <Sidebar />
//       <Box sx={{ flexGrow: 1, p: 4 }}>
//         <TopBar />
//         <Typography variant="h4" sx={{ my: 3, fontWeight: "bold" }}>
//           Executive Admin Dashboard
//         </Typography>
//         <Grid item xs={12} md={4}>
//             <AttendanceTracker />
//           </Grid>
//         {/* Grid Layout for Action Cards */}
//         <Grid container spacing={3}>
//           {sections.map((section, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   p: 2,
//                   boxShadow: 3,
//                   transition: "0.3s",
//                   "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
//                   cursor: "pointer",
//                 }}
//                 onClick={() => navigate(section.route)}
//               >
//                 <Box
//                   sx={{
//                     fontSize: 50,
//                     color: "#7B68EE",
//                     mr: 2,
//                   }}
//                 >
//                   {section.icon}
//                 </Box>
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                     {section.title}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: "gray", mb: 1 }}>
//                     {section.description}
//                   </Typography>
//                 </CardContent>
//                 <IconButton>
//                   <ArrowForwardIosIcon />
//                 </IconButton>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;
// // import React, { useState } from "react";
// // import { Box, Typography, Grid, Card, CardContent, Button, Avatar, Divider } from "@mui/material";
// // import Sidebar from "../components/Sidebar";
// // import TopBar from "../components/AppBar";
// // import CheckIcon from "@mui/icons-material/Check";
// // import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// // import PersonAddIcon from "@mui/icons-material/PersonAdd";
// // import PeopleIcon from "@mui/icons-material/People";

// // const Dashboard = () => {
// //   const [isCheckedIn, setIsCheckedIn] = useState(false);

// //   const toggleCheckIn = () => {
// //     setIsCheckedIn(!isCheckedIn);
// //   };

// //   // Dummy leave requests data
// //   const leaveRequests = [
// //     { id: 1, name: "John Doe", type: "Sick Leave", date: "March 5, 2025", status: "Pending" },
// //     { id: 2, name: "Jane Smith", type: "Vacation", date: "March 10, 2025", status: "Pending" },
// //   ];

// //   return (
// //     <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F8F9FA" }}>
// //       <Sidebar />
// //       <Box sx={{ flexGrow: 1, p: 4 }}>
// //         <TopBar />
// //         <Typography variant="h4" sx={{ my: 3, fontWeight: "bold", color: "#333" }}>
// //           Admin Dashboard
// //         </Typography>

// //         {/* Grid Layout */}
// //         <Grid container spacing={3}>
// //           {/* Check-in/Check-out Section */}
// //           <Grid item xs={12} sm={6} md={4}>
// //             <Card sx={{ p: 3, boxShadow: 3, textAlign: "center", height: "100%" }}>
// //               <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
// //                 Attendance
// //               </Typography>
// //               <Avatar sx={{ width: 80, height: 80, bgcolor: isCheckedIn ? "green" : "gray", mx: "auto", mb: 2 }}>
// //                 {isCheckedIn ? <CheckIcon fontSize="large" /> : <ExitToAppIcon fontSize="large" />}
// //               </Avatar>
// //               <Typography variant="body1" sx={{ mb: 2 }}>
// //                 {isCheckedIn ? "Checked In" : "Checked Out"}
// //               </Typography>
// //               <Button variant="contained" color={isCheckedIn ? "secondary" : "primary"} onClick={toggleCheckIn}>
// //                 {isCheckedIn ? "Check Out" : "Check In"}
// //               </Button>
// //             </Card>
// //           </Grid>

// //           {/* Leave Requests Section */}
// //           <Grid item xs={12} sm={6} md={4}>
// //             <Card sx={{ p: 3, boxShadow: 3, height: "100%" }}>
// //               <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
// //                 Leave Requests
// //               </Typography>
// //               {leaveRequests.map((request, index) => (
// //                 <Box key={request.id} sx={{ mb: 2 }}>
// //                   <Typography variant="body1" sx={{ fontWeight: "bold" }}>{request.name}</Typography>
// //                   <Typography variant="body2" sx={{ color: "gray" }}>
// //                     {request.type} - {request.date}
// //                   </Typography>
// //                   <Typography variant="caption" sx={{ color: request.status === "Pending" ? "orange" : "green" }}>
// //                     {request.status}
// //                   </Typography>
// //                   {index < leaveRequests.length - 1 && <Divider sx={{ my: 2 }} />}
// //                 </Box>
// //               ))}
// //             </Card>
// //           </Grid>

// //           {/* Create Employee Section */}
// //           <Grid item xs={12} sm={6} md={4}>
// //             <Card sx={{ p: 3, boxShadow: 3, textAlign: "center", height: "100%" }}>
// //               <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
// //                 Create Employee
// //               </Typography>
// //               <Avatar sx={{ width: 80, height: 80, bgcolor: "#7B68EE", mx: "auto", mb: 2 }}>
// //                 <PersonAddIcon fontSize="large" />
// //               </Avatar>
// //               <Typography variant="body1" sx={{ mb: 2 }}>
// //                 Add new employees to the system
// //               </Typography>
// //               <Button variant="contained" color="primary" href="/create-employee">
// //                 Add Employee
// //               </Button>
// //             </Card>
// //           </Grid>
// //         </Grid>
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default Dashboard;
// // // import React from "react";
// // // import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
// // // import Sidebar from "../components/Sidebar";
// // // import TopBar from "../components/AppBar";
// // // import AttendanceTracker from "../components/AttendanceTracker";

// // // const Dashboard = () => {
// // //   return (
// // //     <Box sx={{ display: "flex", background: "#f4f4f4", minHeight: "100vh" }}>
// // //       <Sidebar />
// // //       <Box sx={{ flexGrow: 1, p: 3 }}>
// // //         <TopBar />
// // //         <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>Admin Dashboard</Typography>

// // //         <Grid container spacing={3}>
// // //           {/* Attendance Section */}
// // //           <Grid item xs={12} md={4}>
// // //             <AttendanceTracker />
// // //           </Grid>

// // //           {/* Leave Requests Section */}
// // //           <Grid item xs={12} md={4}>
// // //             <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
// // //               <Typography variant="h6" align="center">Leave Requests</Typography>
// // //               <CardContent>
// // //                 <Typography variant="body1">No pending leave requests.</Typography>
// // //                 <Button variant="outlined" sx={{ mt: 2, width: "100%" }}>View All Requests</Button>
// // //               </CardContent>
// // //             </Card>
// // //           </Grid>

// // //           {/* Create Employee Section */}
// // //           <Grid item xs={12} md={4}>
// // //             <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
// // //               <Typography variant="h6" align="center">Create Employee</Typography>
// // //               <CardContent>
// // //                 <Typography variant="body1">Quickly add new employees to the system.</Typography>
// // //                 <Button variant="contained" color="primary" sx={{ mt: 2, width: "100%" }}>Add Employee</Button>
// // //               </CardContent>
// // //             </Card>
// // //           </Grid>
// // //         </Grid>
// // //       </Box>
// // //     </Box>
// // //   );
// // // };

// // // export default Dashboard;

import React from "react";
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
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import WorkOffIcon from "@mui/icons-material/WorkOff";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AttendanceTracker from "../components/AttendanceTracker";

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role"); 

  const sections = [
    {
      title: "Manage Employees",
      description: "Add, edit, and remove employees.",
      icon: <PeopleIcon fontSize="large" />,
      route: "/employees",
      allowedRoles: ["Admin"], // Only Admin can see this
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
        <Typography variant="h4" sx={{ my: 3, fontWeight: "bold" }}>
          Executive Admin Dashboard
        </Typography>
        <Grid item xs={12} md={4}>
          <AttendanceTracker />
        </Grid>

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
