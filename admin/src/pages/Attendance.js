// import React, { useState, useEffect } from "react";
// import { checkIn, checkOut, getAttendanceByUserId } from "../services/attendanceService";
// import { Box, Button, CircularProgress, Typography, LinearProgress, List, ListItem, ListItemText } from "@mui/material";
// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/AppBar";

// const Attendance = () => {npm
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [isCheckedIn, setIsCheckedIn] = useState(false);
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [progress, setProgress] = useState(0); // Progressive Bar State

//   const userId = localStorage.getItem("userId");

//   useEffect(() => {
//     if (userId) {
//       fetchAttendance();
//     }
//   }, []);

//   const fetchAttendance = async () => {
//     try {
//       const records = await getAttendanceByUserId(userId);
//       setAttendanceRecords(records);
// console.log(records,"records")
//       // Calculate progress based on worked hours
//       if (records.length > 0) {
//         const lastRecord = records[records.length - 1];
//         const totalHours = lastRecord.totalHours || 0;
//         setProgress((totalHours / 9) * 100); // 9 hours as full workday
//         setIsCheckedIn(lastRecord.inOutStatus === "IN");
//       }
//     } catch (error) {
//       console.error("Error fetching attendance:", error);
//       setMessage("Failed to load attendance records.");
//     }
//   };

//   const handleAttendance = async (type) => {
//     setLoading(true);
//     setMessage("");

//     try {
//       if (!userId) {
//         throw new Error("User ID not found. Please log in.");
//       }

//       let response;
//       if (type === "check-in") {
//         response = await checkIn(userId);
//         setIsCheckedIn(true);
//       } else {
//         response = await checkOut(userId);
//         setIsCheckedIn(false);
//       }

//       setMessage(response.message);
//       fetchAttendance(); // Refresh attendance records
//     } catch (error) {
//       setMessage(error.toString());
//     }

//     setLoading(false);
//   };

//   return (
//     <Box sx={{ display: "flex", background: "#f4f4f4", minHeight: "100vh" }}>
//       <Sidebar />
//       <Box sx={{ flexGrow: 1, p: 3 }}>
//         <TopBar />
//         <Box sx={{ textAlign: "center", mt: 5 }}>
//           <Typography variant="h4" gutterBottom>
//             Attendance
//           </Typography>

//           <Button
//             variant="contained"
//             color={isCheckedIn ? "secondary" : "primary"}
//             onClick={() => handleAttendance(isCheckedIn ? "check-out" : "check-in")}
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : isCheckedIn ? "Check Out" : "Check In"}
//           </Button>

//           {message && <Typography color="success.main" sx={{ mt: 2 }}>{message}</Typography>}

//           {/* Progress Bar */}
//           <Box sx={{ width: "50%", margin: "20px auto" }}>
//             <Typography variant="body1">Today's Work Progress</Typography>
//             <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
//             <Typography variant="body2">{progress.toFixed(1)}% of 9 hours</Typography>
//           </Box>

//           {/* Attendance Records */}
//           <Box sx={{ mt: 4, p: 2, background: "#fff", borderRadius: 2, boxShadow: 1 }}>
//             <Typography variant="h6" gutterBottom>Attendance Records</Typography>
//             <List>
//               {attendanceRecords.length > 0 ? (
//                 attendanceRecords.map((record, index) => (
//                   <ListItem key={index}>
//                     <ListItemText
//                       primary={`Date: ${record.date} - Status: ${record.status}`}
//                       secondary={`Worked Hours: ${record.totalHours || 0}`}
//                     />
//                   </ListItem>
//                 ))
//               ) : (
//                 <Typography variant="body2">No attendance records found.</Typography>
//               )}
//             </List>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Attendance;
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
  Stack,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";
import { checkIn, checkOut, getAttendanceByUserId } from "../services/attendanceService";

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [progress, setProgress] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchAttendance();
    }
  }, []);

  const fetchAttendance = async () => {
    try {
      const records = await getAttendanceByUserId(userId);
      setAttendanceRecords(records);

      if (records.length > 0) {
        const lastRecord = records[records.length - 1];
        const hoursWorked = lastRecord.totalHours || 0;
        setTotalHours(hoursWorked);
        setProgress((hoursWorked / 9) * 100);
        setIsCheckedIn(lastRecord.inOutStatus === "IN");
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setMessage("Failed to load attendance records.");
    }
  };

  const handleAttendance = async (type) => {
    setLoading(true);
    setMessage("");
    try {
      if (!userId) {
        throw new Error("User ID not found. Please log in.");
      }

      let response;
      if (type === "check-in") {
        response = await checkIn(userId);
        setIsCheckedIn(true);
      } else {
        response = await checkOut(userId);
        setIsCheckedIn(false);
      }

      setMessage(response.message);
      fetchAttendance();
    } catch (error) {
      setMessage(error.toString());
    }
    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", background: "#f4f4f4", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />

        {/* Header */}
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Attendance Tracker
          </Typography>

          {/* Check-In/Out Button */}
          <Button
            variant="contained"
            color={isCheckedIn ? "secondary" : "primary"}
            onClick={() => handleAttendance(isCheckedIn ? "check-out" : "check-in")}
            disabled={loading}
            sx={{ my: 2, px: 4, py: 1.5, fontSize: "1rem" }}
          >
            {loading ? <CircularProgress size={24} /> : isCheckedIn ? "Check Out" : "Check In"}
          </Button>
          {message && <Typography color="success.main" sx={{ mt: 2 }}>{message}</Typography>}
        </Box>

        {/* Live Progress Tracker */}
        <Card sx={{ my: 4, p: 3, borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
          <Typography variant="h6">Today's Work Progress</Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 12, borderRadius: 5, my: 2 }} />
          <Typography variant="body1" fontWeight="bold">{totalHours.toFixed(2)} / 9 hours</Typography>
        </Card>

        {/* Attendance History */}
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>Attendance History</Typography>
          <Divider sx={{ my: 2 }} />
          <List>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record, index) => (
                <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar>{index + 1}</Avatar>
                    <ListItemText
                      primary={`Date: ${record.date}`}
                      secondary={`Total Hours: ${record.totalHours.toFixed(2)} hrs`}
                    />
                  </Stack>
                  <Chip
                    label={record.inOutStatus === "IN" ? "Checked In" : "Checked Out"}
                    color={record.inOutStatus === "IN" ? "success" : "default"}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">No attendance records found.</Typography>
            )}
          </List>
        </Card>
      </Box>
    </Box>
  );
};

export default Attendance;
