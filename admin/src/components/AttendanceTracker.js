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
  Chip,
  Divider,
  Avatar,
  Stack,
} from "@mui/material";
import { checkIn, checkOut, getAttendanceByUserId } from "../services/attendanceService";

const AttendanceTracker = () => {
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
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h6" align="center">Attendance Tracker</Typography>
      <Button
        variant="contained"
        color={isCheckedIn ? "secondary" : "primary"}
        onClick={() => handleAttendance(isCheckedIn ? "check-out" : "check-in")}
        disabled={loading}
        sx={{ my: 2, width: "100%" }}
      >
        {loading ? <CircularProgress size={24} /> : isCheckedIn ? "Check Out" : "Check In"}
      </Button>

      {message && <Typography color="success.main" sx={{ textAlign: "center", mb: 2 }}>{message}</Typography>}

      <Typography variant="body1" align="center">Today's Work Progress</Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, my: 2 }} />
      <Typography variant="body2" align="center">{totalHours.toFixed(2)} / 9 hours</Typography>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>Attendance History</Typography>
      <List>
        {attendanceRecords.length > 0 ? (
          attendanceRecords.map((record, index) => (
            <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar>{index + 1}</Avatar>
                <ListItemText primary={`Date: ${record.date}`} secondary={`Total Hours: ${record.totalHours.toFixed(2)} hrs`} />
              </Stack>
              <Chip label={record.inOutStatus === "IN" ? "Checked In" : "Checked Out"} color={record.inOutStatus === "IN" ? "success" : "default"} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">No attendance records found.</Typography>
        )}
      </List>
    </Card>
  );
};

export default AttendanceTracker;
