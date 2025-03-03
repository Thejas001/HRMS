import React, { useEffect, useState } from "react";
import { getAllAttendance, approveAttendance, deleteAttendance } from "../services/attendanceService";
import { 
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Checkbox 
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";

const AdminAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]); // Stores selected IDs
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  const fetchAllAttendance = async () => {
    setLoading(true);
    try {
      const records = await getAllAttendance();
      setAttendanceRecords(records);
      console.log(records);
      setSelectedRecords([]); // Reset selection after refresh
    } catch (error) {
      setMessage("Failed to fetch attendance records.");
    }
    setLoading(false);
  };

  const handleApprovalChange = async (attendanceIds, status) => {
    setLoading(true);
    try {
      await approveAttendance(attendanceIds, status);
      setMessage(`Attendance ${status.toLowerCase()} successfully!`);
      fetchAllAttendance();
    } catch (error) {
      setMessage(`Failed to ${status.toLowerCase()} attendance.`);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteAttendance(id);
      setMessage("Record deleted successfully!");
      fetchAllAttendance();
    } catch (error) {
      setMessage("Failed to delete attendance record.");
    }
    setLoading(false);
  };

  const toggleSelection = (id) => {
    setSelectedRecords((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((recordId) => recordId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <Box sx={{ display: "flex", background: "#f4f4f4", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h4" gutterBottom>Admin Attendance Management</Typography>

          {loading && <CircularProgress />}
          {message && <Typography color="success.main" sx={{ mt: 2 }}>{message}</Typography>}

          {/* Bulk Approve / Reject Buttons */}
          {/* {selectedRecords.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleApprovalChange(selectedRecords, "Approved")} 
                sx={{ mr: 2 }}
              >
                Approve Selected ({selectedRecords.length})
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => handleApprovalChange(selectedRecords, "Rejected")}
              >
                Reject Selected ({selectedRecords.length})
              </Button>
            </Box>
          )} */}

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell></TableCell> Checkbox column */}
                  <TableCell><b>Employee ID</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Total Hours</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record) => (
                    <TableRow key={record._id}>
                 
                      <TableCell>{record.userId}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.status}</TableCell>
                      <TableCell>{record.totalHours || "N/A"}</TableCell>
                      <TableCell>{record.approvalStatus}</TableCell> 
                      <TableCell>
                        {!record.isApproved && (
                          <>
                            <Button 
                              variant="contained" 
                              color="success" 
                              onClick={() => handleApprovalChange([record._id], "Approved")} 
                              sx={{ mr: 1 }}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="contained" 
                              color="warning" 
                              onClick={() => handleApprovalChange([record._id], "Rejected")} 
                              sx={{ mr: 1 }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="contained" 
                          color="error" 
                          onClick={() => handleDelete(record._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No records found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminAttendance;
