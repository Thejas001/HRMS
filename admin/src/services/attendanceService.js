import axios from "axios";

const API_URL = "http://localhost:5000/api/attendance"; // Update with your backend URL

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ✅ Employee: Check-in
export const checkIn = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/check-in`, { userId }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || "Check-in failed";
  }
};

// ✅ Employee: Check-out
export const checkOut = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/check-out`, { userId }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || "Check-out failed";
  }
};
export const getAttendanceByUserId = async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}`, getAuthHeaders());
    return response.data;
  };
// ✅ Admin/HR: Approve Attendance
export const approveAttendance = async (attendanceIds, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/approve`, 
      { attendanceIds, status },  // Sending both attendanceIds and status
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Approval failed";
  }
};


// ✅ Admin/HR: Get All Attendance Records
export const getAllAttendance = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch attendance";
  }
};

// ✅ Admin: Delete Attendance Record
export const deleteAttendance = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to delete record";
  }
};
