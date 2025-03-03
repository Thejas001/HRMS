


// import React, { useEffect, useState } from "react";
// import { getAllEmployees, deleteEmployee, registerEmployee } from "../services/employeeService";
// import { 
//   Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
//   TableHead, TableRow, Paper, Modal, TextField 
// } from "@mui/material";
// import Sidebar from "../components/Sidebar";
// import TopBar from "../components/AppBar";
// import { Edit } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";

// const Employees = () => {
//   const [employees, setEmployees] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [newEmployee, setNewEmployee] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "User", // Default role
//   });
//   const navigate = useNavigate();
//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const response = await getAllEmployees();
//       setEmployees(response.data);
//       console.log(employees,"emp")
//     } catch (error) {
//       console.error("Error fetching employees", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this employee?")) {
//       try {
//         await deleteEmployee(id);
//         fetchEmployees();
//       } catch (error) {
//         console.error("Error deleting employee:", error.response?.data || error.message);
//         alert("Failed to delete employee.");
//       }
//     }
//   };

//   const handleCreateEmployee = async () => {
//     try {
//       await registerEmployee(newEmployee);
//       setOpen(false);
//       fetchEmployees();
//     } catch (error) {
//       console.error("Error creating employee:", error.response?.data || error.message);
//       alert("Failed to create employee.");
//     }
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <Sidebar />
//       <Box sx={{ flexGrow: 1, p: 3 }}>
//         <TopBar />
//         <Typography variant="h4" sx={{ mb: 3 }}>Employee List</Typography>

//         <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
//           Create Employee
//         </Button>

//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead sx={{ backgroundColor: "#7B68EE" }}>
//               <TableRow>
//               <TableCell>ID</TableCell>
//           <TableCell>User ID</TableCell>
//           <TableCell>Name</TableCell>
//           <TableCell>Position</TableCell>
//           <TableCell>Department</TableCell>
//           <TableCell>Salary</TableCell>
//           <TableCell>Joining Date</TableCell>
//           <TableCell>Reporting Manager</TableCell>
//           <TableCell>Shift Name</TableCell>
//           <TableCell>Shift Start</TableCell>
//           <TableCell>Shift End</TableCell>
//           <TableCell>Added By</TableCell>
//           <TableCell>Created At</TableCell>
//           <TableCell>Updated At</TableCell>
//                 <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {employees.map((employee) => (
//                 <TableRow key={employee.id}>
              
//             <TableCell>{employee.id}</TableCell>
//             <TableCell>{employee.userId}</TableCell>
//             <TableCell>{employee.Name || "N/A"}</TableCell>
//             <TableCell>{employee.position}</TableCell>
//             <TableCell>{employee.department}</TableCell>
//             <TableCell>${parseFloat(employee.salary).toLocaleString()}</TableCell>
//             <TableCell>{new Date(employee.joiningDate).toLocaleDateString()}</TableCell>
//             <TableCell>{employee.reportingManagerId ?? "N/A"}</TableCell>
//             <TableCell>{employee.shiftName || "N/A"}</TableCell>
//             <TableCell>{employee.shiftStartTime || "N/A"}</TableCell>
//             <TableCell>{employee.shiftEndTime || "N/A"}</TableCell>
//             <TableCell>{employee.addedBy ?? "N/A"}</TableCell>
//             <TableCell>{new Date(employee.createdAt).toLocaleString()}</TableCell>
//             <TableCell>{new Date(employee.updatedAt).toLocaleString()}</TableCell>
//                   <TableCell>
//                     <Button onClick={() => handleDelete(employee.id)} sx={{ color: "red" }}>Delete</Button>
//                   </TableCell>
//                   <TableCell>
//                       <Button 
//                                     variant="contained" 
//                                     color="primary" 
//                                     startIcon={<Edit />}
//                                     onClick={() => navigate(`/update/${employee.userId}`)} // Ensure employee._id exists
//                                     disabled={!employee.userId}// Disable button if ID is not available
//                                   >
//                                     Edit Profile
//                                   </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Create Employee Modal */}
//         <Modal open={open} onClose={() => setOpen(false)}>
//           <Box sx={{
//             position: "absolute", top: "50%", left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400, bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 24
//           }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>Create New Employee</Typography>
//             <TextField 
//               fullWidth label="Name" sx={{ mb: 2 }}
//               value={newEmployee.name}
//               onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
//             />
//             <TextField 
//               fullWidth label="Email" sx={{ mb: 2 }}
//               value={newEmployee.email}
//               onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
//             />
//             <TextField 
//               fullWidth label="Password" type="password" sx={{ mb: 2 }}
//               value={newEmployee.password}
//               onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
//             />
//             <TextField 
//               fullWidth label="Role" sx={{ mb: 2 }}
//               value={newEmployee.role}
//               onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
//             />
//             <Button variant="contained" onClick={handleCreateEmployee} sx={{ mr: 2 }}>Create</Button>
//             <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
//           </Box>
//         </Modal>

//       </Box>
//     </Box>
//   );
// };

// export default Employees;
import React, { useEffect, useState } from "react";
import { getAllEmployees, deleteEmployee, registerEmployee } from "../services/employeeService";
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Modal, TextField, TablePagination, Select, MenuItem 
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", password: "", role: "User" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default pagination settings

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error.response?.data || error.message);
        alert("Failed to delete employee.");
      }
    }
  };

  const handleCreateEmployee = async () => {
    try {
      await registerEmployee(newEmployee);
      setOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error creating employee:", error.response?.data || error.message);
      alert("Failed to create employee.");
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F5F5", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>Employee Management</Typography>

        <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2, bgcolor: "#4CAF50" }}>
          + Add Employee
        </Button>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#7B68EE" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.Name || "N/A"}</TableCell>
                  <TableCell>{employee.email || "N/A"}</TableCell>
                  <TableCell>{employee.role || "N/A"}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<Edit />}
                      onClick={() => navigate(`/update/${employee.userId}`)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={employees.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />

        {/* Create Employee Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400, bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 24
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Create New Employee</Typography>
            
            <TextField 
              fullWidth label="Name" sx={{ mb: 2 }}
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            />
            <TextField 
              fullWidth label="Email" sx={{ mb: 2 }}
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            />
            <TextField 
              fullWidth label="Password" type="password" sx={{ mb: 2 }}
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
            />
            <Select
              fullWidth value={newEmployee.role} sx={{ mb: 2 }}
              onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>

            <Button variant="contained" onClick={handleCreateEmployee} sx={{ mr: 2, bgcolor: "#4CAF50" }}>Create</Button>
            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          </Box>
        </Modal>

      </Box>
    </Box>
  );
};

export default Employees;
