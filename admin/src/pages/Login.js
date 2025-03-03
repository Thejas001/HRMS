import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";
import { LockOutlined, Email, VpnKey } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Controls the dialog box
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login successful:", response.data);
      localStorage.setItem("token",  response.data.token);
      localStorage.setItem("userId", response.data. user?.id);
      localStorage.setItem("role",  response.data.user.role);
      localStorage.setItem("username",  response.data.user?.name);
      setOpenDialog(true); // Show success dialog

      // Wait 2 seconds before redirecting to dashboard
      setTimeout(() => {
        setOpenDialog(false);
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error.response?.data);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, textAlign: "center" }}>
          <Avatar sx={{ margin: "auto", bgcolor: "#667eea" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Sign in to access your dashboard
          </Typography>
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
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: "#667eea",
                "&:hover": { bgcolor: "#5648a3" },
              }}
            >
              Login
            </Button>
          </form>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Don't have an account? <a href="/register" style={{ color: "#667eea" }}>Sign up</a>
          </Typography>
        </Paper>
      </Container>

      {/* Dialog Box */}
      <Dialog open={openDialog}>
        <DialogTitle>Login Successful</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Redirecting to Dashboard...</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Login;
