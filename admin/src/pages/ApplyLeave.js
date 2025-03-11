import React, { useState, useEffect } from "react";
import { applyLeave, cancelLeave, getAllLeaves, getLeaveHistory } from "../services/leaveService";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Grid,
  Chip
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";
import DeleteIcon from "@mui/icons-material/Delete";

const leaveTypes = ["Sick Leave", "Casual Leave", "Earned Leave", "Maternity Leave", "Paternity Leave"];

const ApplyLeave = () => {
  const [loading, setLoading] = useState(false);
  const [leaveData, setLeaveData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    console.log("Fetching leave history...");
    try {
      const response = await getLeaveHistory();
      console.log("Leave history fetched:", response.data);
      setLeaveHistory(response.data);
    } catch (error) {
      console.error("Error fetching leave history:", error);
      setMessage({ text: "Failed to fetch leave history.", type: "error" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData((prev) => ({ ...prev, [name]: value }));
  };

  const validateDates = () => {
    const { startDate, endDate } = leaveData;
    if (new Date(endDate) < new Date(startDate)) {
      setMessage({ text: "End date must be after start date.", type: "error" });
      return false;
    }
    return true;
  };

  const handleApplyLeave = async () => {
    console.log("Applying for leave with data:", leaveData);

    if (!leaveData.leaveType || !leaveData.startDate || !leaveData.endDate || !leaveData.reason) {
      setMessage({ text: "All fields are required!", type: "error" });
      return;
    }
    if (!validateDates()) return;

    setLoading(true);
    try {
      const response = await applyLeave(leaveData);
      console.log("Leave applied successfully:", response.data);
      
      setMessage({ text: "Leave applied successfully!", type: "success" });
      fetchLeaveHistory();
      
      // Clearing fields after applying leave
      setLeaveData({ leaveType: "", startDate: "", endDate: "", reason: "" });
    } catch (error) {
      console.error("Error applying leave:", error);
      setMessage({ text: "Failed to apply for leave.", type: "error" });
    }
    setLoading(false);
  };

  const handleCancelLeave = async (leaveId) => {
    console.log("Cancelling leave with ID:", leaveId);
    try {
      await cancelLeave(leaveId);
      console.log("Leave canceled successfully!");
      
      setMessage({ text: "Leave canceled successfully!", type: "success" });
      fetchLeaveHistory();
    } catch (error) {
      console.error("Error canceling leave:", error);
      setMessage({ text: "Failed to cancel leave.", type: "error" });
    }
  };

  return (
    <Box sx={{ display: "flex", background: "#f4f4f4", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />

       <Box sx={{ textAlign: "center", mt: 5 }}>
                 <Typography variant="h4" gutterBottom>
                   Leave managementr
                 </Typography>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom textAlign="center">
                Apply for Leave
              </Typography>

              {/* Leave Type */}
              <TextField
                select
                fullWidth
                label="Leave Type"
                name="leaveType"
                value={leaveData.leaveType}
                onChange={handleChange}
                sx={{ mb: 2 }}
              >
                {leaveTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>{type}</MenuItem>
                ))}
              </TextField>

              {/* Start Date */}
              <TextField
                type="date"
                fullWidth
                label="Start Date"
                name="startDate"
                InputLabelProps={{ shrink: true }}
                value={leaveData.startDate}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              {/* End Date */}
              <TextField
                type="date"
                fullWidth
                label="End Date"
                name="endDate"
                InputLabelProps={{ shrink: true }}
                value={leaveData.endDate}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              {/* Reason */}
              <TextField
                fullWidth
                label="Reason"
                name="reason"
                multiline
                rows={3}
                value={leaveData.reason}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              {/* Apply Button */}
              <Button variant="contained" color="primary" fullWidth onClick={handleApplyLeave} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Apply Leave"}
              </Button>
            </CardContent>
          </Card>

          {/* Leave History */}
         {/* Leave History Section */}
<Card sx={{ mt: 4, p: 3, boxShadow: 3 }}>
  <CardContent>
    <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
      Leave History
    </Typography>

    {leaveHistory.length > 0 ? (
      <Grid container spacing={2}>
        {leaveHistory.map((leave, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ p: 2, borderLeft: `6px solid ${leave.status === "approved" ? "green" : leave.status === "rejected" ? "red" : "orange"}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {leave.leaveType}
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <b>From:</b> {new Date(leave.startDate).toLocaleDateString()} <br />
                  <b>To:</b> {new Date(leave.endDate).toLocaleDateString()}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic", color: "gray" }}>
                  {leave.reason}
                </Typography>

                {/* Status Chip */}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Chip
                    label={leave.status.toUpperCase()}
                    color={leave.status === "approved" ? "success" : leave.status === "rejected" ? "error" : "warning"}
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                  />

                  {/* Cancel Leave Button for Pending Leaves */}
                  {leave.status === "pending" && (
                    <IconButton color="error" onClick={() => handleCancelLeave(leave.id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    ) : (
      <Typography sx={{ textAlign: "center", mt: 2, color: "gray" }}>
        No leave records found.
      </Typography>
    )}
  </CardContent>
</Card>

        </Box>

        {/* Snackbar Message */}
        <Snackbar
          open={Boolean(message.text)}
          autoHideDuration={3000}
          onClose={() => setMessage({ text: "", type: "" })}
        >
          <Alert severity={message.type} sx={{ width: "100%" }}>
            {message.text}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ApplyLeave;
