// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getEmployeeByUserId } from "../services/employeeService";
// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/AppBar";
// import { 
//   Box, Card, CardContent, Typography, CircularProgress, Button, Avatar, Divider 
// } from "@mui/material";
// import { 
//   Person, Work, Business, CalendarToday, MonetizationOn, Schedule, Edit 
// } from "@mui/icons-material";

// const Profile = () => {
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const userId = localStorage.getItem("userId");
//   const username=localStorage.getItem("username")
//   console.log(userId,"user")
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await getEmployeeByUserId(userId);
//         if (response && response.data) {
//           setEmployee(response.data);
//           console.log(employee)
//         } else {
//           setError("Employee details not found.");
//         }
//       } catch (err) {
//         setError("Failed to load employee details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userId]);

//   return (
//     <Box sx={{ display: "flex", background: "#f4f4f4", minHeight: "100vh" }}>
//       <Sidebar />
//       <Box sx={{ flexGrow: 1, p: 3 }}>
//         <TopBar />
//         <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#333" }}>
//           Employee Profile
//         </Typography>

//         {loading ? (
//           <CircularProgress />
//         ) : error ? (
//           <Typography color="error">{error}</Typography>
//         ) : (
//           <Card sx={{ maxWidth: 600, mx: "auto", p: 3, boxShadow: 4, borderRadius: 3 }}>
//             {/* Profile Header */}
//             <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
//               <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: "#007bff" }}>
//                 <Person sx={{ fontSize: 40 }} />
//               </Avatar>
//               <Typography variant="h5" fontWeight="bold" color="#333">
//                 {username || "N/A"}
//               </Typography>
//               <Typography variant="subtitle1" color="text.secondary">
//                 {employee?.position || "N/A"} - {employee?.department || "N/A"}
//               </Typography>
//             </Box>

//             <Divider sx={{ my: 2 }} />

//             {/* Employee Details */}
//             <CardContent>
//               {[
//                 { icon: <Business sx={{ color: "#007bff", mr: 1 }} />, label: "Department", value: employee?.department },
//                 { icon: <Work sx={{ color: "#28a745", mr: 1 }} />, label: "Position", value: employee?.position },
//                 { icon: <CalendarToday sx={{ color: "#ff5733", mr: 1 }} />, label: "Joining Date", value: employee?.joiningDate },
//                 { icon: <MonetizationOn sx={{ color: "#f39c12", mr: 1 }} />, label: "Salary", value: employee?.salary ? `$${employee.salary}` : "N/A" },
//                 { 
//                   icon: <Schedule sx={{ color: "#9b59b6", mr: 1 }} />, 
//                   label: "Shift Timing", 
//                   value: employee?.shiftStartTime && employee?.shiftEndTime 
//                     ? `${employee.shiftStartTime} - ${employee.shiftEndTime}` 
//                     : "N/A" 
//                 },
//               ].map((item, index) => (
//                 <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                   {item.icon}
//                   <Typography variant="h6">
//                     <b>{item.label}:</b> {item.value || "N/A"}
//                   </Typography>
//                 </Box>
//               ))}

//               {/* Edit Profile Button */}
//               <Button 
//                 variant="contained" 
//                 color="primary" 
//                 sx={{ mt: 3, width: "100%" }} 
//                 startIcon={<Edit />}
//                 onClick={() => navigate(`/update/${employee.id}`)} // Ensure employee._id exists
//                 disabled={!employee?.id} // Disable button if ID is not available
//               >
//                 Edit Profile
//               </Button>

//             </CardContent>
//           </Card>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default Profile;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeByUserId } from "../services/employeeService";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";
import { 
  Box, Card, CardContent, Typography, CircularProgress, Button, Avatar, Divider, IconButton 
} from "@mui/material";
import { 
  Person, Work, Business, CalendarToday, MonetizationOn, Schedule, Edit, ErrorOutline 
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

  return (
    <Box sx={{ display: "flex", background: "#F0F2F5", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />

        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#333", textAlign: "center" }}>
          Employee Profile
        </Typography>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <ErrorOutline sx={{ color: "red", fontSize: 50 }} />
            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
          </Box>
        )}

        {/* Profile Card */}
        {!loading && !error && (
          <Card sx={{ maxWidth: 600, mx: "auto", p: 3, boxShadow: 4, borderRadius: 3, background: "#FFFFFF" }}>
            {/* Profile Header */}
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mb: 2 }}>
              <Avatar sx={{ width: 90, height: 90, mb: 2, bgcolor: "#007bff", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
                <Person sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {username || "N/A"}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {employee?.position || "N/A"} - {employee?.department || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2, backgroundColor: "#ccc" }} />

            {/* Employee Details */}
            <CardContent>
              {[
                { icon: <Business sx={{ color: "#007bff", mr: 1 }} />, label: "Department", value: employee?.department },
                { icon: <Work sx={{ color: "#28a745", mr: 1 }} />, label: "Position", value: employee?.position },
                { icon: <CalendarToday sx={{ color: "#ff5733", mr: 1 }} />, label: "Joining Date", value: employee?.joiningDate },
                { icon: <MonetizationOn sx={{ color: "#f39c12", mr: 1 }} />, label: "Salary", value: employee?.salary ? `$${employee.salary}` : "N/A" },
                { 
                  icon: <Schedule sx={{ color: "#9b59b6", mr: 1 }} />, 
                  label: "Shift Timing", 
                  value: employee?.shiftStartTime && employee?.shiftEndTime 
                    ? `${employee.shiftStartTime} - ${employee.shiftEndTime}` 
                    : "N/A" 
                },
              ].map((item, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2, background: "#F8F9FA", p: 1.5, borderRadius: 2 }}>
                  {item.icon}
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
                    {item.label}:
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 1, color: "#555" }}>
                    {item.value || "N/A"}
                  </Typography>
                </Box>
              ))}

              {/* Edit Profile Button */}
              <Button 
                variant="contained"
                sx={{ 
                  mt: 3, 
                  width: "100%", 
                  background: "linear-gradient(to right, #007bff, #0056b3)",
                  "&:hover": { background: "linear-gradient(to right, #0056b3, #003d7a)" },
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
                startIcon={<Edit />}
                onClick={() => navigate(`/update/${employee.id}`)}
                disabled={!employee?.id}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
