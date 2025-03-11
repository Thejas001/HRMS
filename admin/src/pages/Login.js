
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import bgImage from "../assets/login/bg.png"; 
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   Box,
//   Avatar,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   CircularProgress,
//   Grid,
// } from "@mui/material";
// import { LockOutlined, Email, VpnKey } from "@mui/icons-material";
// import { load, Loginlogo,logo } from "../assets/index.js";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/users/login",
//         { email, password },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("userId", response.data.user?.id);
//       localStorage.setItem("role", response.data.user.role);
//       localStorage.setItem("username", response.data.user?.name);
//       setOpenDialog(true);

//       setTimeout(() => {
//         setOpenDialog(false);
//         navigate("/dashboard");
//       }, 2000);
//     } catch (error) {
//       console.error("Login error:", error.response?.data);
//       alert(error.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <Grid container sx={{ height: "100vh" }}>
//      <Box
//   sx={{
//     position: "absolute",
//     top: 20,
//     left: 20,
//   }}
// >
//   <img src={logo} alt="Logo" width={262} height={51} />
// </Box>
     
//       <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F8F9FA" }}>
//         <Container maxWidth="xs">
//           <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, textAlign: "center" }}>
//             <Avatar sx={{ margin: "auto", bgcolor: "#293EED" }}>
//               <LockOutlined />
//             </Avatar>
//             <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold", color: "#626262" }}>
//               Welcome to Wruk !
//             </Typography>
//             <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
//               please Login to continue
//             </Typography>
//             <form onSubmit={handleLogin}>
//               <TextField
//                 label="Email"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 margin="normal"
//                 InputProps={{
//                   startAdornment: <Email color="action" sx={{ mr: 1 }} />,
//                 }}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <TextField
//                 label="Password"
//                 type="password"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 margin="normal"
//                 InputProps={{
//                   startAdornment: <VpnKey color="action" sx={{ mr: 1 }} />,
//                 }}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <Button
//                 type="submit"
//                 variant="contained"
//                 fullWidth
//                 sx={{ mt: 2, bgcolor: "#293EED", "&:hover": { bgcolor: "#1E2DAA" ,borderRadius:"20px"} }}
//               >
//                 Login
//               </Button>
//             </form>
//           </Paper>
//         </Container>
//       </Grid>

//       {/* Right Side - Image */}
//       <Grid
//   item
//   xs={12}
//   md={6}
//   sx={{
//    backgroundImage: `url(${bgImage})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   }}
// >
//   {/* <Loginlogo /> */}
// </Grid>


//       {/* Dialog Box */}
//       <Dialog open={openDialog}>
//         <DialogTitle>Login Successful</DialogTitle>
//         <DialogContent>
//         <img src={load} alt="Logo" width={262} height={51} />
//           <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//             <CircularProgress />
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </Grid>
//   );
// };

// export default Login;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/login/bg.png";
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
} from "@mui/material";
import { LockOutlined, Email, VpnKey } from "@mui/icons-material";
import { load, Loginlogo, logo } from "../assets/index.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user?.id);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("username", response.data.user?.name);
      setOpenDialog(true); // Show loading dialog

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
    <Grid container sx={{ height: "100vh" }}>
      {/* Logo */}
      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
        <img src={logo} alt="Logo" width={262} height={51} />
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
              Welcome to Wruk!
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Please login to continue
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
                  bgcolor: "#293EED",
                  borderRadius: "20px",
                  "&:hover": { bgcolor: "#1E2DAA", borderRadius: "20px" },
                }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </Container>
      </Grid>

      {/* Right - Background Image */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Loginlogo /> */}
      </Grid>

      {/* Loading Dialog */}
      <Dialog open={openDialog}>
        {/* <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#333" }}>
          Login Successful
        </DialogTitle> */}
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <img src={load} alt="Loading..." width={800} />
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default Login;
