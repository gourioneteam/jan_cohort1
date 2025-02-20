const jwt = require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/usermodel")

module.exports = async (req, res, next) => {
  try {
    // Extract token from the Authorization header (Bearer token)
    const token = req.header("Authorization")?.split(" ")[1]; 

    // If no token, deny access
    if (!token) return res.status(401).json({ message: "Access Denied! No token provided." });

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded)
    // Attach the user information to the request
    req.user = await User.findById(decoded.id).select("-password"); // Exclude password from user info

    // If the user is not found, return an unauthorized error
    if (!req.user) return res.status(401).json({ message: "Unauthorized: User not found" });

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication Error:", error); // Log error
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


// exports.protect = async (req, res, next) => {
//   try {
//     // Extract token from the Authorization header (Bearer token)
//     const token = req.header("Authorization")?.split(" ")[1]; 

//     // If no token, deny access
//     if (!token) return res.status(401).json({ message: "Access Denied! No token provided." });

//     // Verify the JWT token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach the user information to the request
//     req.user = await User.findById(decoded.id).select("-password"); // Exclude password from user info

//     // If the user is not found, return an unauthorized error
//     if (!req.user) return res.status(401).json({ message: "Unauthorized: User not found" });

//     // Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error("Authentication Error:", error); // Log error
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// Middleware for admin-only access (optional, based on your needs)
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};