const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    try {
        const token = req.header('Authorization');

        // 🔹 Debugging: Log the token
        console.log("Received Token:", token);

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // 🔹 Remove "Bearer " if present
        const cleanToken = token.replace("Bearer ", "").trim();

        // 🔹 Verify token
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

        // 🔹 Attach user to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
};
