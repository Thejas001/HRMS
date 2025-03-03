const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Employee } = require("../models");
require("dotenv").config();

// Register a new user (with optional employee record)
// exports.register = async (req, res) => {
//     try {
//         const { name, email, password, role, position, department, salary, joiningDate } = req.body;

//         // Check if the email is already used
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) return res.status(400).json({ message: 'Email already in use' });

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create the user
//         const newUser = await User.create({ name, email, password: hashedPassword, role });

//         // If the user is an employee, create an entry in Employee table
//         console.log("Creating employee record for:", newUser.id, position, department, salary, joiningDate);

//         if (roleLower === 'employee') {
//             employeeRecord = await Employee.create({
//                 userId: newUser.id,
//                 position,
//                 department,
//                 salary,
//                 joiningDate
//             });
//         }

//         res.status(201).json({
//             message: 'User registered successfully',
//             user: newUser,
//             employee: employeeRecord
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error registering user', error });
//     }
// };

exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Employee", // Default role is Employee
    });

    // Automatically add this user to the Employee table with empty details
    await Employee.create({
      userId: newUser.id,
      position: null,
      department: null,
      salary: null,
      joiningDate: null,
      Name:newUser.name,
      reportingManagerId:null,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get user by ID (Admin only)
exports.getUserById = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ name, email, role });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
