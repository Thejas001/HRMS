import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeByUserId } from "../services/employeeService";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";
import { 
  Box, Card, CardContent, Typography, CircularProgress, Button, Avatar, Divider, 
  Grid, Chip, Paper, Alert, Container, Stack, IconButton, Tooltip
} from "@mui/material";
import { 
  Person, Work, Business, CalendarToday, MonetizationOn, Schedule, Edit, 
  Phone, Email, LocationOn, Badge, School, Description, CheckCircle, 
  PendingActions, Cancel, Star, TrendingUp, VerifiedUser, AccessTime
} from "@mui/icons-material";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getEmployeeByUserId(userId);
        if (response && response.data) {
          setEmployee(response.data);
        } else {
          setError("Employee details not found.");
        }
      } catch (err) {
        setError("Failed to load employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to get status chip
  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: <PendingActions />, label: 'Pending', bgColor: '#fff3cd' },
      accepted: { color: 'success', icon: <CheckCircle />, label: 'Accepted', bgColor: '#d4edda' },
      rejected: { color: 'error', icon: <Cancel />, label: 'Rejected', bgColor: '#f8d7da' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        variant="filled"
        size="medium"
        sx={{ 
          backgroundColor: config.bgColor,
          fontWeight: 'bold',
          '& .MuiChip-icon': { color: config.color === 'success' ? '#28a745' : config.color === 'warning' ? '#ffc107' : '#dc3545' }
        }}
      />
    );
  };

  // Helper function to get full name
  const getFullName = () => {
    if (!employee) return username || "N/A";
    const { firstName, middleName, lastName } = employee;
    return `${firstName || ''} ${middleName ? middleName + ' ' : ''}${lastName || ''}`.trim() || username || "N/A";
  };

  // Helper function to calculate experience years
  const getExperienceYears = () => {
    if (!employee?.workExperience) return "N/A";
    const match = employee.workExperience.match(/(\d+)/);
    return match ? `${match[1]} years` : employee.workExperience;
  };

  return (
    <Box sx={{ display: "flex", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />

        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 4, 
              fontWeight: "bold", 
              color: "#fff", 
              textAlign: "center",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              letterSpacing: "1px"
            }}
          >
          Employee Profile
        </Typography>

        {/* Loading State */}
        {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <CircularProgress size={60} sx={{ color: "#fff" }} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ textAlign: "center", mt: 5 }}>
              <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", fontSize: "1.1rem" }}>
                {error}
              </Alert>
          </Box>
        )}

          {/* Profile Content */}
          {!loading && !error && employee && (
            <Grid container spacing={4}>
              {/* Main Profile Card */}
              <Grid item xs={12} lg={4}>
                <Card sx={{ 
                  p: 4, 
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)", 
                  borderRadius: 4, 
                  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)"
                }}>
            {/* Profile Header */}
                  <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mb: 4 }}>
                    <Box sx={{ 
                      position: "relative", 
                      mb: 3,
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: "-8px",
                        left: "-8px",
                        right: "-8px",
                        bottom: "-8px",
                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                        borderRadius: "50%",
                        zIndex: -1
                      }
                    }}>
                      <Avatar sx={{ 
                        width: 120, 
                        height: 120, 
                        bgcolor: "#667eea",
                        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                        border: "4px solid #fff"
                      }}>
                        <Person sx={{ fontSize: 60 }} />
              </Avatar>
                    </Box>
                    
                    <Typography variant="h4" fontWeight="bold" color="#2c3e50" textAlign="center" sx={{ mb: 1 }}>
                      {getFullName()}
              </Typography>
                    
                    <Typography variant="h6" color="#7f8c8d" textAlign="center" sx={{ mb: 2 }}>
                      {employee.position || "Employee"} • {employee.department || "Department"}
              </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      {getStatusChip(employee.applicationStatus)}
                    </Box>

                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                      <Tooltip title="Employee ID">
                        <Chip 
                          icon={<Badge />} 
                          label={`ID: ${employee.id || "N/A"}`}
                          variant="outlined"
                          color="primary"
                        />
                      </Tooltip>
                      <Tooltip title="Experience">
                        <Chip 
                          icon={<TrendingUp />} 
                          label={getExperienceYears()}
                          variant="outlined"
                          color="secondary"
                        />
                      </Tooltip>
                    </Stack>
            </Box>

                  <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

                  {/* Quick Stats */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" color="#2c3e50" sx={{ mb: 2 }}>
                      Quick Overview
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                          <Typography variant="h4" color="#667eea" fontWeight="bold">
                            {employee.age || "N/A"}
                  </Typography>
                          <Typography variant="body2" color="#7f8c8d">Age</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                          <Typography variant="h4" color="#667eea" fontWeight="bold">
                            {employee.nationality || "N/A"}
                  </Typography>
                          <Typography variant="body2" color="#7f8c8d">Nationality</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                </Box>

              {/* Edit Profile Button */}
              <Button 
                variant="contained"
                    fullWidth
                    size="large"
                sx={{ 
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      "&:hover": { 
                        background: "linear-gradient(45deg, #5a6fd8, #6a4190)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)"
                      },
                  color: "#fff",
                  fontWeight: "bold",
                      borderRadius: 3,
                      py: 1.5,
                      transition: "all 0.3s ease"
                }}
                startIcon={<Edit />}
                onClick={() => navigate(`/update/${employee.id}`)}
                disabled={!employee?.id}
              >
                Edit Profile
              </Button>
                </Card>
              </Grid>

              {/* Detailed Information */}
              <Grid item xs={12} lg={8}>
                <Grid container spacing={3}>
                  {/* Work Information */}
                  <Grid item xs={12}>
                    <Card sx={{ 
                      p: 4, 
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)", 
                      borderRadius: 4,
                      background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                      border: "1px solid rgba(255,255,255,0.2)"
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: "#667eea", 
                          borderRadius: 3, 
                          mr: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <Work sx={{ color: "#fff", fontSize: 28 }} />
                        </Box>
                        <Typography variant="h5" fontWeight="bold" color="#2c3e50">
                          Work Information
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 3, bgcolor: "#f8f9fa", borderRadius: 3, height: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                              <Business sx={{ color: "#667eea", mr: 2, fontSize: 24 }} />
                              <Box>
                                <Typography variant="body2" color="#7f8c8d" sx={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "bold" }}>
                                  Department
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="#2c3e50">
                                  {employee.department || "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 3, bgcolor: "#f8f9fa", borderRadius: 3, height: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                              <Work sx={{ color: "#28a745", mr: 2, fontSize: 24 }} />
                              <Box>
                                <Typography variant="body2" color="#7f8c8d" sx={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "bold" }}>
                                  Position
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="#2c3e50">
                                  {employee.position || "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 3, bgcolor: "#f8f9fa", borderRadius: 3, height: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                              <CalendarToday sx={{ color: "#ff5733", mr: 2, fontSize: 24 }} />
                              <Box>
                                <Typography variant="body2" color="#7f8c8d" sx={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "bold" }}>
                                  Joining Date
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="#2c3e50">
                                  {formatDate(employee.joiningDate)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 3, bgcolor: "#f8f9fa", borderRadius: 3, height: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                              <MonetizationOn sx={{ color: "#f39c12", mr: 2, fontSize: 24 }} />
                              <Box>
                                <Typography variant="body2" color="#7f8c8d" sx={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "bold" }}>
                                  Salary
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="#2c3e50">
                                  {employee.salary ? `$${employee.salary.toLocaleString()}` : "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Box sx={{ p: 3, bgcolor: "#f8f9fa", borderRadius: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                              <AccessTime sx={{ color: "#9b59b6", mr: 2, fontSize: 24 }} />
                              <Box>
                                <Typography variant="body2" color="#7f8c8d" sx={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "bold" }}>
                                  Shift Timing
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="#2c3e50">
                                  {employee.shiftStartTime && employee.shiftEndTime 
                                    ? `${employee.shiftStartTime} - ${employee.shiftEndTime}` 
                                    : "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>

                  {/* Contact Information */}
                  <Grid item xs={12}>
                    <Card sx={{ 
                      p: 4, 
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)", 
                      borderRadius: 4,
                      background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                      border: "1px solid rgba(255,255,255,0.2)"
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: "#28a745", 
                          borderRadius: 3, 
                          mr: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <Phone sx={{ color: "#fff", fontSize: 28 }} />
                        </Box>
                        <Typography variant="h5" fontWeight="bold" color="#2c3e50">
                          Contact Information
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 3, bgcolor: "#f8f9fa", borderRadius: 3, height: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                              <Phone sx={{ color: "#667eea", mr: 2, fontSize: 24 }} />
                              <Box>
                                <Typography variant="body2" color="#7f8c8d" sx={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "bold" }}>
                                  Mobile Number
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="#2c3e50">
                                  {employee.mobileNumber || "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 3, bgcolor: "#f8f9fa", borderRadius: 3, height: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                              <Email sx={{ color: "#28a745", mr: 2, fontSize: 24 }} />
                              <Box>
                                <Typography variant="body2" color="#7f8c8d" sx={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "bold" }}>
                                  Email
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="#2c3e50">
                                  {username || "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Box sx={{ p: 3, bgcolor: "#f8f9fa", borderRadius: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                              <LocationOn sx={{ color: "#ff5733", mr: 2, fontSize: 24 }} />
                              <Box>
                                <Typography variant="body2" color="#7f8c8d" sx={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "bold" }}>
                                  Address
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="#2c3e50">
                                  {employee.address ? `${employee.address}, ${employee.state} ${employee.pinCode}` : "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>

                  {/* Documents Status */}
                  <Grid item xs={12}>
                    <Card sx={{ 
                      p: 4, 
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)", 
                      borderRadius: 4,
                      background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                      border: "1px solid rgba(255,255,255,0.2)"
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: "#9b59b6", 
                          borderRadius: 3, 
                          mr: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <Description sx={{ color: "#fff", fontSize: 28 }} />
                        </Box>
                        <Typography variant="h5" fontWeight="bold" color="#2c3e50">
                          Documents Status
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ 
                            textAlign: "center", 
                            p: 4, 
                            border: "2px solid #e0e0e0", 
                            borderRadius: 3,
                            bgcolor: employee.certificate ? "#d4edda" : "#f8f9fa",
                            transition: "all 0.3s ease",
                            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }
                          }}>
                            <Box sx={{ 
                              width: 60, 
                              height: 60, 
                              borderRadius: "50%", 
                              bgcolor: employee.certificate ? "#28a745" : "#6c757d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mx: "auto",
                              mb: 2
                            }}>
                              {employee.certificate ? <CheckCircle sx={{ color: "#fff", fontSize: 30 }} /> : <Description sx={{ color: "#fff", fontSize: 30 }} />}
                            </Box>
                            <Typography variant="h6" fontWeight="bold" color="#2c3e50" sx={{ mb: 1 }}>
                              Certificate
                            </Typography>
                            <Chip 
                              label={employee.certificate ? "Uploaded" : "Not Uploaded"} 
                              color={employee.certificate ? "success" : "default"}
                              variant="filled"
                              sx={{ fontWeight: "bold" }}
                            />
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ 
                            textAlign: "center", 
                            p: 4, 
                            border: "2px solid #e0e0e0", 
                            borderRadius: 3,
                            bgcolor: employee.aadharCard ? "#d4edda" : "#f8f9fa",
                            transition: "all 0.3s ease",
                            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }
                          }}>
                            <Box sx={{ 
                              width: 60, 
                              height: 60, 
                              borderRadius: "50%", 
                              bgcolor: employee.aadharCard ? "#28a745" : "#6c757d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mx: "auto",
                              mb: 2
                            }}>
                              {employee.aadharCard ? <CheckCircle sx={{ color: "#fff", fontSize: 30 }} /> : <Description sx={{ color: "#fff", fontSize: 30 }} />}
                            </Box>
                            <Typography variant="h6" fontWeight="bold" color="#2c3e50" sx={{ mb: 1 }}>
                              Aadhar Card
                            </Typography>
                            <Chip 
                              label={employee.aadharCard ? "Uploaded" : "Not Uploaded"} 
                              color={employee.aadharCard ? "success" : "default"}
                              variant="filled"
                              sx={{ fontWeight: "bold" }}
                            />
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ 
                            textAlign: "center", 
                            p: 4, 
                            border: "2px solid #e0e0e0", 
                            borderRadius: 3,
                            bgcolor: employee.panCard ? "#d4edda" : "#f8f9fa",
                            transition: "all 0.3s ease",
                            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }
                          }}>
                            <Box sx={{ 
                              width: 60, 
                              height: 60, 
                              borderRadius: "50%", 
                              bgcolor: employee.panCard ? "#28a745" : "#6c757d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mx: "auto",
                              mb: 2
                            }}>
                              {employee.panCard ? <CheckCircle sx={{ color: "#fff", fontSize: 30 }} /> : <Description sx={{ color: "#fff", fontSize: 30 }} />}
                            </Box>
                            <Typography variant="h6" fontWeight="bold" color="#2c3e50" sx={{ mb: 1 }}>
                              PAN Card
                            </Typography>
                            <Chip 
                              label={employee.panCard ? "Uploaded" : "Not Uploaded"} 
                              color={employee.panCard ? "success" : "default"}
                              variant="filled"
                              sx={{ fontWeight: "bold" }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
          </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
        )}
        </Container>
      </Box>
    </Box>
  );
};

export default Profile;
