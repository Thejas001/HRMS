// src/pages/WorkerApplication.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Download,
  Visibility,
  Description,
  CreditCard,
  Person,
  Work,
} from "@mui/icons-material";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";

const WorkerApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetailApplication, setSelectedDetailApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/employee/admin/employee/pending-applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/employee/verify/${id}`,
        { status: "accepted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchApplications();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application. Please try again.");
    }
    setLoading(false);
  };

  const handleReject = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/employee/verify/${id}`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchApplications();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application. Please try again.");
    }
    setLoading(false);
  };

  const openDialog = (application, actionType) => {
    setSelectedApplication(application);
    setAction(actionType);
    setDialogOpen(true);
  };

  const openDetailDialog = (application) => {
    setSelectedDetailApplication(application);
    setDetailDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleFileView = (filePath, fileName) => {
    if (!filePath) {
      alert(`${fileName} is not uploaded`);
      return;
    }
    
    // Open file in new tab
    const fileUrl = `http://localhost:5000/${filePath}`;
    window.open(fileUrl, '_blank');
  };

  const handleFileDownload = (filePath, fileName) => {
    if (!filePath) {
      alert(`${fileName} is not uploaded`);
      return;
    }
    
    // Create download link
    const fileUrl = `http://localhost:5000/${filePath}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileName = (filePath) => {
    if (!filePath) return null;
    return filePath.split('/').pop();
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F5F5", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Worker Applications
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#7B68EE" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Full Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Age</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>State</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Documents</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <TableRow key={app.id} hover>
                      <TableCell>{app.id}</TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {app.fullName}
                        </Typography>
                      </TableCell>
                      <TableCell>{app.age}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.phone || "N/A"}</TableCell>
                      <TableCell>{app.state}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Chip 
                            size="small" 
                            label={`Cert: ${app.certificate ? '✓' : '✗'}`}
                            color={app.certificate ? 'success' : 'error'}
                            variant="outlined"
                          />
                          <Chip 
                            size="small" 
                            label={`Aadhar: ${app.aadharCard ? '✓' : '✗'}`}
                            color={app.aadharCard ? 'success' : 'error'}
                            variant="outlined"
                          />
                          <Chip 
                            size="small" 
                            label={`PAN: ${app.panCard ? '✓' : '✗'}`}
                            color={app.panCard ? 'success' : 'error'}
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(app.applicationStatus)}
                          color={getStatusColor(app.applicationStatus)}
                          variant="outlined"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => openDetailDialog(app)}
                        >
                          View Details
                        </Button>
                        {app.applicationStatus === "pending" && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => openDialog(app, "approve")}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => openDialog(app, "reject")}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {app.applicationStatus !== "pending" && (
                          <Typography variant="body2" color="textSecondary">
                            {app.applicationStatus === "accepted" ? "Approved" : "Rejected"}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body1" color="textSecondary">
                        No worker applications found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>
            Confirm {action === "approve" ? "Approval" : "Rejection"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to{" "}
              <strong>{action === "approve" ? "approve" : "reject"}</strong> the application for{" "}
              <strong>
                {selectedApplication?.firstName} {selectedApplication?.lastName}
              </strong>
              ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={() =>
                action === "approve"
                  ? handleApprove(selectedApplication.id)
                  : handleReject(selectedApplication.id)
              }
              color={action === "approve" ? "success" : "error"}
              variant="contained"
            >
              {action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Detailed View Dialog */}
        <Dialog 
          open={detailDialogOpen} 
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Worker Application Details
          </DialogTitle>
          <DialogContent>
            {selectedDetailApplication && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                      Personal Information
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Full Name:</strong> {selectedDetailApplication.fullName}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Age:</strong> {selectedDetailApplication.age} years
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {selectedDetailApplication.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Phone:</strong> {selectedDetailApplication.phone}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Nationality:</strong> {selectedDetailApplication.nationality}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                      Address Information
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Address:</strong> {selectedDetailApplication.address}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>State:</strong> {selectedDetailApplication.state}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>PIN Code:</strong> {selectedDetailApplication.pinCode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                      Professional Information
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Work Experience:</strong> {selectedDetailApplication.workExperience}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Application Status:</strong>{" "}
                      <Chip
                        label={getStatusText(selectedDetailApplication.applicationStatus)}
                        color={getStatusColor(selectedDetailApplication.applicationStatus)}
                        variant="outlined"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Applied On:</strong> {new Date(selectedDetailApplication.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                      Uploaded Documents
                    </Typography>
                    <Grid container spacing={2}>
                      {/* Work Experience Certificate */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{ border: selectedDetailApplication.certificate ? '2px solid #4caf50' : '2px solid #f44336' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Work sx={{ mr: 1, color: selectedDetailApplication.certificate ? '#4caf50' : '#f44336' }} />
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Work Experience Certificate
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                              {selectedDetailApplication.certificate ? 
                                `File: ${getFileName(selectedDetailApplication.certificate)}` : 
                                'No certificate uploaded'
                              }
                            </Typography>
                            <CardActions>
                              <Tooltip title="View Certificate">
                                <IconButton 
                                  onClick={() => handleFileView(selectedDetailApplication.certificate, 'Work Experience Certificate')}
                                  color="primary"
                                  disabled={!selectedDetailApplication.certificate}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download Certificate">
                                <IconButton 
                                  onClick={() => handleFileDownload(selectedDetailApplication.certificate, 'Work_Experience_Certificate.pdf')}
                                  color="primary"
                                  disabled={!selectedDetailApplication.certificate}
                                >
                                  <Download />
                                </IconButton>
                              </Tooltip>
                            </CardActions>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Aadhar Card */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{ border: selectedDetailApplication.aadharCard ? '2px solid #4caf50' : '2px solid #f44336' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CreditCard sx={{ mr: 1, color: selectedDetailApplication.aadharCard ? '#4caf50' : '#f44336' }} />
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Aadhar Card
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                              {selectedDetailApplication.aadharCard ? 
                                `File: ${getFileName(selectedDetailApplication.aadharCard)}` : 
                                'No Aadhar card uploaded'
                              }
                            </Typography>
                            <CardActions>
                              <Tooltip title="View Aadhar Card">
                                <IconButton 
                                  onClick={() => handleFileView(selectedDetailApplication.aadharCard, 'Aadhar Card')}
                                  color="primary"
                                  disabled={!selectedDetailApplication.aadharCard}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download Aadhar Card">
                                <IconButton 
                                  onClick={() => handleFileDownload(selectedDetailApplication.aadharCard, 'Aadhar_Card.pdf')}
                                  color="primary"
                                  disabled={!selectedDetailApplication.aadharCard}
                                >
                                  <Download />
                                </IconButton>
                              </Tooltip>
                            </CardActions>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* PAN Card */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{ border: selectedDetailApplication.panCard ? '2px solid #4caf50' : '2px solid #f44336' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CreditCard sx={{ mr: 1, color: selectedDetailApplication.panCard ? '#4caf50' : '#f44336' }} />
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                PAN Card
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                              {selectedDetailApplication.panCard ? 
                                `File: ${getFileName(selectedDetailApplication.panCard)}` : 
                                'No PAN card uploaded'
                              }
                            </Typography>
                            <CardActions>
                              <Tooltip title="View PAN Card">
                                <IconButton 
                                  onClick={() => handleFileView(selectedDetailApplication.panCard, 'PAN Card')}
                                  color="primary"
                                  disabled={!selectedDetailApplication.panCard}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download PAN Card">
                                <IconButton 
                                  onClick={() => handleFileDownload(selectedDetailApplication.panCard, 'PAN_Card.pdf')}
                                  color="primary"
                                  disabled={!selectedDetailApplication.panCard}
                                >
                                  <Download />
                                </IconButton>
                              </Tooltip>
                            </CardActions>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Profile Picture */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{ border: selectedDetailApplication.profilePic ? '2px solid #4caf50' : '2px solid #f44336' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Person sx={{ mr: 1, color: selectedDetailApplication.profilePic ? '#4caf50' : '#f44336' }} />
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Profile Picture
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                              {selectedDetailApplication.profilePic ? 
                                `File: ${getFileName(selectedDetailApplication.profilePic)}` : 
                                'No profile picture uploaded'
                              }
                            </Typography>
                            <CardActions>
                              <Tooltip title="View Profile Picture">
                                <IconButton 
                                  onClick={() => handleFileView(selectedDetailApplication.profilePic, 'Profile Picture')}
                                  color="primary"
                                  disabled={!selectedDetailApplication.profilePic}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download Profile Picture">
                                <IconButton 
                                  onClick={() => handleFileDownload(selectedDetailApplication.profilePic, 'Profile_Picture.jpg')}
                                  color="primary"
                                  disabled={!selectedDetailApplication.profilePic}
                                >
                                  <Download />
                                </IconButton>
                              </Tooltip>
                            </CardActions>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default WorkerApplication;
