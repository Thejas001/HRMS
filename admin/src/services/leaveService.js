
import axios from "axios";
const API_URL = "http://localhost:5000/api/leave"; // Replace with your actual backend URL




const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ✅ Apply Leave (Ensure request body is correct)
export const applyLeave = async ({ userId, startDate, endDate, leaveType, reason }) => {
  if ( !startDate || !endDate || !leaveType || !reason) {
    throw new Error("All fields are required.");
  }

  try {
    const response = await axios.post(`${API_URL}/apply`, { userId, startDate, endDate, leaveType, reason }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Apply Leave Error:", error.response?.data || error.message);
    throw error.response?.data || "Leave application failed.";
  }
};


export const getLeaveHistory = async () => {
  return axios.get(`${API_URL}/history`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cancelLeave = async (leaveId) => {
  return axios.delete(`${API_URL}/leave/cancel/${leaveId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Admin APIs
export const getAllLeaves = async () => {
  return axios.get(`${API_URL}/all`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateLeaveStatus = async (leaveId, status) => {
  const requestBody = { status };  // Ensure proper formatting
  const url = `${API_URL}/${leaveId}/status`;

  console.log("🔵 PUT Request URL:", url);
  console.log("🟢 Request Body:", JSON.stringify(requestBody));

  return axios.put(url, requestBody, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json", // Ensure this is set
    },
  });
};

