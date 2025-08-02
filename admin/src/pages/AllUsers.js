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
  Paper,
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
  Work,
  AdminPanelSettings,
  Refresh
} from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    customers: 0,
    workers: 0,
    admins: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      
      if (!token) {
        setSnackbar({
          open: true,
          message: "No authentication token found. Please log in again.",
          severity: "error"
        });
        return;
      }

      // Try to fetch users from different endpoints
      const allUsers = [];
      
      // Test endpoint 1: /api/users (Customers)
      try {
        const customersRes = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (customersRes.data && Array.isArray(customersRes.data)) {
          // Direct array response
          const customers = customersRes.data.map(user => ({
            ...user,
            type: "Customer",
            role: "Customer"
          }));
          allUsers.push(...customers);
        } else if (customersRes.data.success && customersRes.data.data) {
          // Success wrapper response
          const customers = customersRes.data.data.map(user => ({
            ...user,
            type: "Customer",
            role: "Customer"
          }));
          allUsers.push(...customers);
        }
      } catch (error) {
        console.error("Error fetching customers:", error.response?.status, error.response?.data);
      }

      // Test endpoint 2: /api/employee (Workers)
      try {
        const workersRes = await axios.get("http://localhost:5000/api/employee", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (workersRes.data && Array.isArray(workersRes.data)) {
          // Direct array response
          const workers = workersRes.data.map(worker => ({
            ...worker,
            type: "Worker",
            role: worker.applicationStatus === "accepted" ? "Worker" : "Pending Worker",
            name: worker.firstName && worker.lastName ? `${worker.firstName} ${worker.lastName}` : worker.name || "Unknown"
          }));
          allUsers.push(...workers);
        } else if (workersRes.data.success && workersRes.data.data) {
          // Success wrapper response
          const workers = workersRes.data.data.map(worker => ({
            ...worker,
            type: "Worker",
            role: worker.applicationStatus === "accepted" ? "Worker" : "Pending Worker",
            name: worker.firstName && worker.lastName ? `${worker.firstName} ${worker.lastName}` : worker.name || "Unknown"
          }));
          allUsers.push(...workers);
        }
      } catch (error) {
        console.error("Error fetching workers:", error.response?.status, error.response?.data);
      }

      // Test endpoint 3: /api/employees (Employees/Admins)
      try {
        const employeesRes = await axios.get("http://localhost:5000/api/employees", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (employeesRes.data && Array.isArray(employeesRes.data)) {
          // Direct array response
          const employees = employeesRes.data.map(emp => ({
            ...emp,
            type: "Employee",
            role: emp.role || "Employee",
            name: emp.Name || emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Unknown"
          }));
          allUsers.push(...employees);
        } else if (employeesRes.data.success && employeesRes.data.data) {
          // Success wrapper response
          const employees = employeesRes.data.data.map(emp => ({
            ...emp,
            type: "Employee",
            role: emp.role || "Employee",
            name: emp.Name || emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Unknown"
          }));
          allUsers.push(...employees);
        }
      } catch (error) {
        console.error("Error fetching employees:", error.response?.status, error.response?.data);
      }

      setUsers(allUsers);

      // Calculate stats
      const stats = {
        total: allUsers.length,
        active: allUsers.filter(u => u.status !== "inactive").length,
        inactive: allUsers.filter(u => u.status === "inactive").length,
        customers: allUsers.filter(u => u.type === "Customer").length,
        workers: allUsers.filter(u => u.type === "Worker").length,
        admins: allUsers.filter(u => u.role === "Admin").length
      };
      setStats(stats);

      if (allUsers.length === 0) {
        setSnackbar({
          open: true,
          message: "No users found. Check browser console for API errors.",
          severity: "warning"
        });
      } else {
        setSnackbar({
          open: true,
          message: `Successfully loaded ${allUsers.length} users`,
          severity: "success"
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

  const getRoleChip = (role) => {
    const roleConfig = {
      Admin: { color: "error", icon: <AdminPanelSettings /> },
      Customer: { color: "primary", icon: <Person /> },
      Worker: { color: "success", icon: <Work /> },
      Employee: { color: "info", icon: <Person /> }
    };
    const config = roleConfig[role] || roleConfig.Employee;
    
    return (
      <Chip
        icon={config.icon}
        label={role}
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
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
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
            <Typography variant="h6">Loading users...</Typography>
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
          User Management
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Total Users"
              value={stats.total}
              color="#7B68EE"
              icon={<Person />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Active Users"
              value={stats.active}
              color="#4CAF50"
              icon={<CheckCircle />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Customers"
              value={stats.customers}
              color="#2196F3"
              icon={<Person />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Workers"
              value={stats.workers}
              color="#FF9800"
              icon={<Work />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Admins"
              value={stats.admins}
              color="#F44336"
              icon={<AdminPanelSettings />}
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
                  placeholder="Search users..."
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
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="Customer">Customer</MenuItem>
                    <MenuItem value="Worker">Worker</MenuItem>
                    <MenuItem value="Employee">Employee</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
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
              All Users ({filteredUsers.length})
            </Typography>
            
            {filteredUsers.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                  No users found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {searchTerm || statusFilter !== "all" || roleFilter !== "all" 
                    ? "Try adjusting your filters or search terms"
                    : "No users are currently registered in the system"
                  }
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#7B68EE" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>User</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Type</TableCell>
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
                        <TableCell>{getRoleChip(user.role)}</TableCell>
                        <TableCell>{getStatusChip(user.status || "active")}</TableCell>
                        <TableCell>
                          <Chip label={user.type} size="small" />
                        </TableCell>
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
                            <Tooltip title="Delete User">
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
                  User Details
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
                  <Typography variant="body2" color="textSecondary">Role</Typography>
                  {getRoleChip(selectedUser.role)}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Status</Typography>
                  {getStatusChip(selectedUser.status || "active")}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">Type</Typography>
                  <Chip label={selectedUser.type} size="small" />
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

export default AllUsers; 