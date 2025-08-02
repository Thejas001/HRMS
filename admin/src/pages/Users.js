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
  Person,
  Refresh
} from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
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
        const customersRes = await axios.get("http://localhost:5000/api/users/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let customers = [];
        if (customersRes.data && Array.isArray(customersRes.data)) {
          // Filter for only customers (role "User")
          customers = customersRes.data
            .filter(user => user.role === "User")
            .map(user => ({
              ...user,
              type: "Customer",
              role: "Customer"
            }));
        } else if (customersRes.data.success && customersRes.data.data) {
          // Filter for only customers (role "User")
          customers = customersRes.data.data
            .filter(user => user.role === "User")
            .map(user => ({
              ...user,
              type: "Customer",
              role: "Customer"
            }));
        }
        
        setUsers(customers);

        // Calculate stats
        const stats = {
          total: customers.length,
          active: customers.filter(u => u.status !== "inactive").length,
          inactive: customers.filter(u => u.status === "inactive").length
        };
        setStats(stats);

        if (customers.length === 0) {
          setSnackbar({
            open: true,
            message: "No customers found.",
            severity: "warning"
          });
        } else {
          setSnackbar({
            open: true,
            message: `Successfully loaded ${customers.length} customers`,
            severity: "success"
          });
        }

      } catch (error) {
        console.error("Error fetching customers:", error.response?.status, error.response?.data);
        setSnackbar({
          open: true,
          message: "Failed to fetch customers: " + (error.response?.data?.message || error.message),
          severity: "error"
        });
      }

    } catch (error) {
      console.error("Error fetching users:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch users: " + (error.response?.data?.message || error.message),
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      await axios.put(`http://localhost:5000/api/users/${userId}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: `User status updated to ${newStatus}`,
        severity: "success"
      });
      fetchUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update user status",
        severity: "error"
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSnackbar({
          open: true,
          message: "User deleted successfully",
          severity: "success"
        });
        fetchUsers();
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete user",
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
            <Typography variant="h6">Loading customers...</Typography>
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
          Customer Management
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Customers"
              value={stats.total}
              color="#7B68EE"
              icon={<Person />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Active Customers"
              value={stats.active}
              color="#4CAF50"
              icon={<CheckCircle />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Inactive Customers"
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search customers..."
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
              <Grid item xs={12} md={3}>
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
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchUsers}
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              All Customers ({filteredUsers.length})
            </Typography>
            
            {filteredUsers.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                  No customers found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your filters or search terms"
                    : "No customers are currently registered in the system"
                  }
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#7B68EE" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Customer</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Created</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {user.name?.charAt(0) || user.firstName?.charAt(0) || "U"}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {user.name || `${user.firstName || ""} ${user.lastName || ""}`}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                ID: {user.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || user.phoneNumber || "N/A"}</TableCell>
                        <TableCell>{getStatusChip(user.status || "active")}</TableCell>
                        <TableCell>
                          {new Date(user.createdAt || user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setOpenModal(true);
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Toggle Status">
                              <Switch
                                size="small"
                                checked={user.status !== "inactive"}
                                onChange={() => handleStatusChange(
                                  user.id,
                                  user.status === "inactive" ? "active" : "inactive"
                                )}
                              />
                            </Tooltip>
                            <Tooltip title="Delete Customer">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user.id)}
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

        {/* User Details Modal */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="user-details-modal"
        >
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}>
            {selectedUser && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Customer Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Name</Typography>
                  <Typography variant="body1">
                    {selectedUser.name || `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{selectedUser.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{selectedUser.phone || selectedUser.phoneNumber || "N/A"}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Status</Typography>
                  {getStatusChip(selectedUser.status || "active")}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Created</Typography>
                  <Typography variant="body1">
                    {new Date(selectedUser.createdAt || selectedUser.created_at).toLocaleString()}
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

export default Users; 