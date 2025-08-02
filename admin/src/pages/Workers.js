import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  TextField,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Snackbar,
  Avatar,
  Tooltip,
  Switch,
  CircularProgress
} from "@mui/material";
import {
  Search,
  Delete,
  Visibility,
  Block,
  CheckCircle,
  Warning,
  Work,
  Refresh
} from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";
import axios from "axios";

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applicationFilter, setApplicationFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    accepted: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      
      if (!token) {
        setSnackbar({
          open: true,
          message: "No authentication token found. Please log in again.",
          severity: "error"
        });
        return;
      }

      try {
        const workersRes = await axios.get("http://localhost:5000/api/employee", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let workers = [];
        if (workersRes.data && Array.isArray(workersRes.data)) {
          // Filter for only workers (role "Employee")
          workers = workersRes.data
            .filter(worker => worker.role === "Employee" || worker.applicationStatus)
            .map(worker => ({
              ...worker,
              type: "Worker",
              role: worker.applicationStatus === "accepted" ? "Worker" : "Pending Worker",
              name: worker.firstName && worker.lastName ? `${worker.firstName} ${worker.lastName}` : worker.name || "Unknown"
            }));
        } else if (workersRes.data.success && workersRes.data.data) {
          // Filter for only workers (role "Employee")
          workers = workersRes.data.data
            .filter(worker => worker.role === "Employee" || worker.applicationStatus)
            .map(worker => ({
              ...worker,
              type: "Worker",
              role: worker.applicationStatus === "accepted" ? "Worker" : "Pending Worker",
              name: worker.firstName && worker.lastName ? `${worker.firstName} ${worker.lastName}` : worker.name || "Unknown"
            }));
        }
        
        setWorkers(workers);

        // Calculate stats
        const stats = {
          total: workers.length,
          active: workers.filter(w => w.status !== "inactive").length,
          inactive: workers.filter(w => w.status === "inactive").length,
          accepted: workers.filter(w => w.applicationStatus === "accepted").length,
          pending: workers.filter(w => w.applicationStatus === "pending").length,
          rejected: workers.filter(w => w.applicationStatus === "rejected").length
        };
        setStats(stats);

        if (workers.length === 0) {
          setSnackbar({
            open: true,
            message: "No workers found.",
            severity: "warning"
          });
        } else {
          setSnackbar({
            open: true,
            message: `Successfully loaded ${workers.length} workers`,
            severity: "success"
          });
        }

      } catch (error) {
        console.error("Error fetching workers:", error.response?.status, error.response?.data);
        setSnackbar({
          open: true,
          message: "Failed to fetch workers: " + (error.response?.data?.message || error.message),
          severity: "error"
        });
      }

    } catch (error) {
      console.error("Error fetching workers:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch workers: " + (error.response?.data?.message || error.message),
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (workerId, newStatus) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      await axios.put(`http://localhost:5000/api/employee/${workerId}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: `Worker status updated to ${newStatus}`,
        severity: "success"
      });
      fetchWorkers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update worker status",
        severity: "error"
      });
    }
  };

  const handleDeleteWorker = async (workerId) => {
    if (window.confirm("Are you sure you want to delete this worker?")) {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
        await axios.delete(`http://localhost:5000/api/employee/${workerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSnackbar({
          open: true,
          message: "Worker deleted successfully",
          severity: "success"
        });
        fetchWorkers();
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete worker",
          severity: "error"
        });
      }
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { color: "success", icon: <CheckCircle /> },
      inactive: { color: "error", icon: <Block /> },
      pending: { color: "warning", icon: <Warning /> }
    };
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Chip
        icon={config.icon}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={config.color}
        size="small"
      />
    );
  };

  const getApplicationStatusChip = (status) => {
    const statusConfig = {
      accepted: { color: "success", icon: <CheckCircle /> },
      pending: { color: "warning", icon: <Warning /> },
      rejected: { color: "error", icon: <Block /> }
    };
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Chip
        icon={config.icon}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={config.color}
        size="small"
      />
    );
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = 
      worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
    const matchesApplication = applicationFilter === "all" || worker.applicationStatus === applicationFilter;
    
    return matchesSearch && matchesStatus && matchesApplication;
  });

  const StatCard = ({ title, value, color, icon }) => (
    <Card sx={{ minWidth: 200, bgcolor: color }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ color: "white", opacity: 0.8 }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ color: "white", opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F8F9FA" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">Loading workers...</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#F8F9FA" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <TopBar />
        
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Worker Management
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Total Workers"
              value={stats.total}
              color="#7B68EE"
              icon={<Work />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Active Workers"
              value={stats.active}
              color="#4CAF50"
              icon={<CheckCircle />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Accepted"
              value={stats.accepted}
              color="#2196F3"
              icon={<CheckCircle />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Pending"
              value={stats.pending}
              color="#FF9800"
              icon={<Warning />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Rejected"
              value={stats.rejected}
              color="#F44336"
              icon={<Block />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Inactive"
              value={stats.inactive}
              color="#9E9E9E"
              icon={<Block />}
            />
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search workers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Application Status</InputLabel>
                  <Select
                    value={applicationFilter}
                    onChange={(e) => setApplicationFilter(e.target.value)}
                    label="Application Status"
                  >
                    <MenuItem value="all">All Applications</MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchWorkers}
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Workers Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              All Workers ({filteredWorkers.length})
            </Typography>
            
            {filteredWorkers.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                  No workers found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {searchTerm || statusFilter !== "all" || applicationFilter !== "all"
                    ? "Try adjusting your filters or search terms"
                    : "No workers are currently registered in the system"
                  }
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#7B68EE" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Worker</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Application</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Created</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWorkers.map((worker) => (
                      <TableRow key={worker.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {worker.name?.charAt(0) || worker.firstName?.charAt(0) || "W"}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {worker.name || `${worker.firstName || ""} ${worker.lastName || ""}`}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                ID: {worker.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{worker.email}</TableCell>
                        <TableCell>{worker.mobileNumber || worker.phone || "N/A"}</TableCell>
                        <TableCell>
                          <Chip 
                            label={worker.applicationStatus === "accepted" ? "Worker" : "Pending Worker"}
                            color={worker.applicationStatus === "accepted" ? "success" : "warning"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={worker.status === "inactive" ? "Inactive" : "Active"}
                            color={worker.status === "inactive" ? "error" : "success"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{getApplicationStatusChip(worker.applicationStatus || "pending")}</TableCell>
                        <TableCell>
                          {new Date(worker.createdAt || worker.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedWorker(worker);
                                  setOpenModal(true);
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Toggle Status">
                              <Switch
                                size="small"
                                checked={worker.status !== "inactive"}
                                onChange={() => handleStatusChange(
                                  worker.id,
                                  worker.status === "inactive" ? "active" : "inactive"
                                )}
                              />
                            </Tooltip>
                            <Tooltip title="Delete Worker">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteWorker(worker.id)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Worker Details Modal */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="worker-details-modal"
        >
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}>
            {selectedWorker && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Worker Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Name</Typography>
                  <Typography variant="body1">
                    {selectedWorker.name || `${selectedWorker.firstName || ""} ${selectedWorker.lastName || ""}`}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{selectedWorker.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{selectedWorker.mobileNumber || selectedWorker.phone || "N/A"}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Age</Typography>
                  <Typography variant="body1">{selectedWorker.age || "N/A"}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Address</Typography>
                  <Typography variant="body1">{selectedWorker.address || "N/A"}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Work Experience</Typography>
                  <Typography variant="body1">{selectedWorker.workExperience || "N/A"}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Status</Typography>
                  {getStatusChip(selectedWorker.status || "active")}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Application Status</Typography>
                  {getApplicationStatusChip(selectedWorker.applicationStatus || "pending")}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Created</Typography>
                  <Typography variant="body1">
                    {new Date(selectedWorker.createdAt || selectedWorker.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button onClick={() => setOpenModal(false)}>Close</Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Workers; 