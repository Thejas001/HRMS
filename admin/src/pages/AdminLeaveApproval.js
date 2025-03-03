import React, { useEffect, useState } from "react";
import { getAllLeaves, updateLeaveStatus } from "../services/leaveService";
import { 
  Box, Button, CircularProgress, Typography, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, 
  DialogActions, DialogContent, DialogContentText 
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";

const AdminLeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await getAllLeaves();
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
    setLoading(false);
  };

  const handleApproval = async () => {
    if (!selectedLeave || !action) return; // Ensure selectedLeave and action exist
  
    setLoading(true);
    
    const requestBody = { status: action }; // Create request body
    console.log("Updating Leave Status:", requestBody); // Log request body before sending
  
    try {
      await updateLeaveStatus(selectedLeave.id, action);
      await fetchLeaves(); // Ensure data updates after approval
      setDialogOpen(false); // Close dialog after successful update
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("Failed to update leave status. Please try again."); // Show user-friendly message
    }
    
    setLoading(false);
  };
  

  const openDialog = (leave, actionType) => {
    setSelectedLeave(leave);
    setAction(actionType);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ display: "flex", background: "#f4f4f4", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Leave Approvals
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#1976D2" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>User</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Leave Type</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Duration</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>{leave.userId}</TableCell>
                      <TableCell>{leave.leaveType
                      }</TableCell>
                      <TableCell>
                        {leave.startDate} → {leave.endDate}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: leave.status === "pending" ? "orange" : leave.status === "Approved" ? "green" : "red" }}>
                          {leave.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {leave.status === "pending" && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => openDialog(leave, "approved")}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => openDialog(leave, "rejected")}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No leave requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Confirm {action}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to <strong>{action.toLowerCase()}</strong> this leave request for <strong>{selectedLeave?.userId}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleApproval} color={action === "Approved" ? "success" : "error"}>
              {action}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminLeaveApproval;
