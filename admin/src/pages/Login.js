import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Alert,
  CircularProgress
} from "@mui/material";
import { LockOutlined, Email, VpnKey } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      console.log("Attempting login with:", { email, password });
      
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login response:", response.data);

      if (response.data.message === "Admin login successful") {
        // Store the token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user?.id);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("username", response.data.user?.name);
        
        console.log("✅ Login successful! Redirecting to dashboard...");
        
        setOpenDialog(true); // Show loading dialog

        setTimeout(() => {
          setOpenDialog(false);
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Logo */}
      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#293EED" }}>
          WorkHub Admin
        </Typography>
      </Box>

      {/* Left - Login Form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8F9FA",
        }}
      >
        <Container maxWidth="xs">
          <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, textAlign: "center" }}>
            <Avatar sx={{ margin: "auto", bgcolor: "#293EED" }}>
              <LockOutlined />
            </Avatar>
            <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold", color: "#626262" }}>
              Welcome to WorkHub Admin!
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Please login to continue
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                InputProps={{
                  startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                InputProps={{
                  startAdornment: <VpnKey color="action" sx={{ mr: 1 }} />,
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#293EED",
                  "&:hover": { backgroundColor: "#1E2B9B" },
                }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
            
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#293EED", textDecoration: "none" }}>
                Register here
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Grid>

      {/* Right - Background */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ textAlign: "center", color: "white" }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            WorkHub
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Admin Dashboard
          </Typography>
        </Box>
      </Grid>

      {/* Loading Dialog */}
      <Dialog open={openDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Logging in...</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 2 }}>
            <CircularProgress size={60} sx={{ color: "#293EED" }} />
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default Login;
