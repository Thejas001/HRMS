
🏢  Employee Management System  🚀  

A  full-stack Employee Management System  built using  Node.js, MySQL, and React .  
This system helps organizations efficiently manage employees, track attendance, handle leave requests, schedule shifts, and perform various  HR operations .  

 

   🎨  Screenshots & Flow Diagram   

    🔹  System Flow Diagram   
    ![image](https://github.com/user-attachments/assets/c733ec5a-8c04-4469-95ca-7ca2e1793d45)

 
    🔹  Login Screen  
    ![image](https://github.com/user-attachments/assets/c545632a-1745-45fa-ade5-8b675ba6d72d)

 
    🔹  Admin Dashboard   
    ![image](https://github.com/user-attachments/assets/9c2dc05f-fc1c-4470-bb4a-4a0bc375d9f2)

 
 

   🚀  Key Features   

    🔐  Authentication & Role-Based Access   
✔ Secure login system with  JWT authentication   
✔ Role-based access control for  employees and admins   

    📊  Attendance Management   
✔ Employees can  check in/out  with timestamps  
✔ Admins can  monitor and generate reports   

    📅  Leave Management   
✔ Employees can  request leaves   
✔ Admins can  approve/reject leave requests   
✔ Leave balance tracking  

    ⏳  Shift Management   
✔ Assign, update, and manage  employee work shifts   
✔ Flexible scheduling  

    🎯  Admin Dashboard   
✔ Full control over  employee records, approvals, and reports   
✔ Manage attendance, leaves, shifts, and user roles  

 

   🛠️  Tech Stack   

🔹  Frontend:  React.js, React Router, Axios  
🔹  Backend:  Node.js, Express.js  
🔹  Database:  MySQL  
🔹  Authentication:  JWT (JSON Web Tokens)  
🔹  State Management:  React Context API  
🔹  API Requests:  Axios  

 

   📂  Project Structure   
/employee-management
│── backend/                  Node.js Backend
│   ├── config/               Database & Auth Configs
│   ├── controllers/          Business Logic (Auth, Employees, Leaves, Shifts)
│   ├── models/               Database Models (MySQL)
│   ├── routes/               API Routes
│   ├── middleware/           JWT Authentication & Role-based access
│   ├── server.js             Main Server File
│
│── frontend/                 React Frontend
│   ├── src/
│   │   ├── components/       Reusable UI Components
│   │   ├── pages/            App Pages (Dashboard, Attendance, Leave, etc.)
│   │   ├── context/          React Context API for State Management
│   │   ├── services/         API Calls with Axios
│   │   ├── App.js            Main App Component
│   │   ├── index.js          React DOM Rendering
│
│── README.md                 Project Documentation
│── package.json              Dependencies & Scripts
│── .env                      Environment Variables
 

 

   ⚡  Installation & Setup   

    🛠️  1️⃣ Clone the Repository   
 bash
git clone https://github.com/Sivaroyal007/HRMS.git
cd employee-management
 

    🛠️  2️⃣ Backend Setup (Node.js + MySQL)   
 bash
cd backend
npm install
 
- Create a `.env` file in the `backend` directory and add:  
   ini
  DB_HOST=your_mysql_host
  DB_USER=your_mysql_user
  DB_PASSWORD=your_mysql_password
  DB_NAME=employee_management
  JWT_SECRET=your_secret_key
   
- Run migrations to set up the database:
   bash
  node setupDatabase.js
   
- Start the backend server:
   bash
  npm start
   

    🛠️  3️⃣ Frontend Setup (React.js)   
 bash
cd frontend
npm install
npm start
 

 

   🎥  Demo   
[![Watch Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://youtu.be/YOUR_VIDEO_ID)  
📌 *Click the image to watch the demo video*  

 

   📌  API Endpoints (Backend)   

|  Method  |  Endpoint          |  Description                  |
|   --|       |           |
| `POST`    | `/api/auth/login`   | User login                     |
| `POST`    | `/api/auth/register`| Register new employee/admin    |
| `GET`     | `/api/employees`    | Get all employees (Admin only) |
| `POST`    | `/api/attendance`   | Mark attendance                |
| `GET`     | `/api/attendance`   | Get attendance records         |
| `POST`    | `/api/leaves`       | Request leave                  |
| `GET`     | `/api/leaves`       | Get leave requests (Admin)     |
| `POST`    | `/api/shifts`       | Assign shifts (Admin)          |
| `GET`     | `/api/shifts`       | Get shift schedules            |

 

   🎯  Future Enhancements   
✔ Payroll integration  
✔ Notifications & email alerts  
✔ Mobile app version  

 

   🤝  Contribution   

🚀 Want to improve this project?  Fork the repo, create a new branch, and submit a pull request!   

 

   📞  Contact   

💼  Name:   Siva Sai Royal   
📧  Email:  [sivaroyal423@gmail.com](mailto:sivaroyal423@gmail.com)  
📞  Phone:  `+91 82967349`  
🔗  LinkedIn:  [Siva Sai Royal](https://www.linkedin.com/in/sivasai-royal/)  

 

💡  If you find this project useful, don’t forget to ⭐ the repository!   

 ️⃣   NodeJS  ReactJS  MySQL  EmployeeManagement  HRTech  SoftwareDevelopment  WebApp   
