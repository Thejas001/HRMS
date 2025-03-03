
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeByUserId, updateEmployee } from "../services/employeeService";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";
import { 
  Box, Card, CardContent, Typography, TextField, Button, CircularProgress, Avatar, Divider 
} from "@mui/material";
import { 
  Person, Work, Business, CalendarToday, MonetizationOn, Schedule, Save, ArrowBack 
} from "@mui/icons-material";

const EditProfile = () => {
  const { id } = useParams(); // Get ID from the URL // Fetch userId from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    Name: "",
    position: "",
    department: "",
    joiningDate: "",
    salary: "",
    shiftStartTime: "",
    shiftEndTime: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employeeId, setEmployeeId] = useState(null); // Store the employee ID separately
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await getEmployeeByUserId(userId); // Fetch employee details
        if (response && response.data) {
          setFormData(response.data);
          setEmployeeId(response.data.id); // Store the employee ID from response
        } else {
          setError("Employee details not found.");
        }
      } catch (err) {
        setError("Failed to load employee details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Updated Employee Data:", formData); 

    if (!employeeId) {
      setError("Employee ID is missing. Cannot update profile.");
      return;
    }

    try {
      await updateEmployee(employeeId, formData); // Use the correct employee ID
      // navigate(`/profile/${id}`); // Redirect to profile page
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: "flex", background: "#f4f4f4", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#333" }}>
          Edit Employee Profile
        </Typography>

        <Card sx={{ maxWidth: 600, mx: "auto", p: 3, boxShadow: 4, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: "#007bff" }}>
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" color="#333">
              {formData.Name || "N/A"}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {formData.position || "N/A"} - {formData.department || "N/A"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Shift Start Time"
                name="shiftStartTime"
                type="time"
                value={formData.shiftStartTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Shift End Time"
                name="shiftEndTime"
                type="time"
                value={formData.shiftEndTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  startIcon={<ArrowBack />} 
                  // onClick={() => navigate(`/profile/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" startIcon={<Save />}>
                  Save Changes
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EditProfile;
