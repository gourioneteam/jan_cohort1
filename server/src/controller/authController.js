const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register Admin
exports.registerAdmin = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if admin exists
      let admin = await User.findOne({ email });
      if (admin) return res.status(400).json({ message: "Admin already exists" });
  
      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create Admin User
      admin = new User({
        name,
        email,
        password: hashedPassword,
        role: "admin",
        createdBy: null // Admin does not need createdBy
      });
  
      await admin.save();
  
      res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)

    // Check if user exists
    const user = await User.findOne({email});
    console.log(user)
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log(token)
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
