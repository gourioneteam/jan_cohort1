require("dotenv").config();
const User = require("../models/usermodel");
const Feedback = require("../models/feedbackModel");
const StudentCourseBatch = require("../models/studentcoursemodel");
const Batch = require("../models/batchModel");
const Course = require("../models/courseModel");
const Trainer = require("../models/trainerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { cloudinary } = require('../config/cloudianryconfig');

// npm install cloudinary multer-storage-cloudinary


// Multer setup for profile image upload

// Register Student (Admin only)
exports.registerStudent = async (req, res) => {
  try {
    console.log(req.body)

    const { name, email } = req.body;
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Only admin can register students" });
    }

    // Check if email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate default password (first 5 chars of email + last 3 chars of name)
    // const defaultPassword = `${email.slice(0, 5)}${name.slice(-3)}`;
    const defaultPassword="student"
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const student = new User({
      name,
      email,
      password: hashedPassword,
      role: "student",
      createdBy: req.user.id,
      isFirstLogin: true
    });

    await student.save();
    
    res.status(201).json({ 
      message: "Student registered successfully", 
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        defaultPassword
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Student Login
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await User.findOne({ email, role: "student" });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student._id, role: student.role, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ 
      message: "Login successful", 
      token, 
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        isFirstLogin: student.isFirstLogin
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const student = await User.findById(req.user.id);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update password and first login status
    student.password = hashedPassword;
    student.isFirstLogin = false;
    await student.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const student = await User.findById(req.user.id);
    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Unauthorized: Only students can upload images" });
    }
    // If there's an existing image, delete it from Cloudinary
    if (student.profileImageUrl) {
      const publicId = student.profileImageUrl.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`student-profiles/${publicId}`);
      } catch (error) {
        console.error("Error deleting old image:", error);
      }    }
    // Save the new Cloudinary URL
    student.profileImageUrl = req.file.path;
    await student.save();
    res.json({      message: "Profile image updated successfully",
      profileImageUrl: student.profileImageUrl
    });
  } catch (error) {
    console.error("Profile Image Upload Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.viewProfile = async (req, res) => {
  try {
    // Ensure the user ID is available in the request
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User ID is missing in the request" });
    }

    // Find the student by ID and exclude the password field
    const student = await User.findById(req.user.id)
      .select("-password")
      .populate({
        path: 'createdBy',
        select: 'name email'
      });

    // If no student is found, return a 404 error
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Prepare the profile data
    const profileData = {
      ...student.toObject(), // Convert Mongoose document to a plain JavaScript object
      profileImageUrl: student.profileImageUrl || null // Ensure profileImageUrl is set or null
    };

    // Send the profile data as a response
    res.status(200).json(profileData);
  } catch (error) {
    console.error("View Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const student = await User.findById(req.user.id);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (email && email !== student.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      student.email = email;
    }

    if (name) {
      student.name = name;
    }

    await student.save();
    res.json({ 
      message: "Profile updated successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Submit Feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { trainerId, courseId, batchId, ratings, comments, week } = req.body;
    
    // Verify that the student is enrolled in this batch
    const enrollment = await StudentCourseBatch.findOne({
      studentId: req.user.id,
      courseId,
      batchId
    });

    if (!enrollment) {
      return res.status(403).json({ 
        message: "You are not enrolled in this batch" 
      });
    }

    // Check if feedback already exists for this week
    const existingFeedback = await Feedback.findOne({
      studentId: req.user.id,
      trainerId,
      courseId,
      batchId,
      week
    });

    if (existingFeedback) {
      return res.status(400).json({ 
        message: "Feedback already submitted for this week" 
      });
    }

    // Validate ratings
    const ratingFields = ['knowledge', 'communication', 'punctuality'];
    for (const field of ratingFields) {
      if (!ratings[field] || ratings[field] < 1 || ratings[field] > 5) {
        return res.status(400).json({ 
          message: `Invalid rating for ${field}. Must be between 1 and 5` 
        });
      }
    }

    const feedback = new Feedback({
      studentId: req.user.id,
      trainerId,
      courseId,
      batchId,
      ratings,
      comments,
      week,
      createdBy: req.user.id
    });

    await feedback.save();

    res.status(201).json({ 
      message: "Feedback submitted successfully", 
      feedback 
    });
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// View Batch Details
// exports.viewBatchDetails = async (req, res) => {
//   try {
//     const studentCourses = await StudentCourseBatch.find({ 
//       studentId: req.user.id 
//     }).populate([
//       {
//         path: 'batchId',
//         select: 'batchName startDate endDate'
//       },
//       {
//         path: 'courseId',
//         select: 'name description duration'
//       },
//       {
//         path: 'trainerId',
//         select: 'name email subject'
//       }
//     ]);

//     if (!studentCourses.length) {
//       return res.status(404).json({ message: "No batch details found for student" });
//     }

//     res.json(studentCourses);
//   } catch (error) {
//     console.error("View Batch Details Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


exports.viewBatchDetails = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }
   
    console.log(req.user.id)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { studentId: req.user.id, isActive: true };

    const studentCourses = await StudentCourseBatch.find(query)
      .populate({
        path: 'batchId',
        select: 'batchName startDate endDate status',
        match: { status: { $ne: 'deleted' } }
      })
      .populate({
        path: 'courseId',
        select: 'name description duration price',
        match: { isActive: true }
      })
      .populate({
        path: 'trainerId',
        select: 'name ',
        match: { isActive: true }
      })
      .skip(skip)
      .limit(limit)
      .lean();
      console.log("Raw Student Courses:", studentCourses);
      const filteredCourses = studentCourses.filter(course => 
        course.batchId && course.courseId && course.trainerId
      );
      
      console.log(filteredCourses);console.log(filteredCourses)
    if (!filteredCourses.length) {
      return res.status(404).json({ success: false, message: "No active batch enrollments found" });
    }

    const totalCount = await StudentCourseBatch.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: filteredCourses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error("Error fetching batch details:", error);
    return res.status(500).json({ success: false, message: "An error occurred while fetching batch details" });
  }
}



//feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { trainerId, courseId, batchId, ratings, comments, week } = req.body;
    const studentId = req.user.id; // Get the logged-in student's ID

    // Verify student's enrollment in the course & batch
    const enrollment = await StudentCourseBatch.findOne({
      studentId,
      courseId,
      batchId,
      isActive: true
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this batch"
      });
    }

    // Ensure the trainer is actually a trainer
    const trainer = await User.findOne({ _id: trainerId, role: 'trainer' });
    if (!trainer) {
      return res.status(400).json({
        success: false,
        message: "Invalid trainer ID. The user is not a trainer."
      });
    }

    // Check if feedback already exists for this student, trainer, course, batch, and week
    const existingFeedback = await Feedback.findOne({
      studentId,
      trainerId,
      courseId,
      batchId,
      week
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted feedback for this week."
      });
    }

    // Validate ratings (ensure all fields exist and are between 1-5)
    const requiredRatings = ['knowledge', 'communication', 'punctuality'];
    for (const field of requiredRatings) {
      if (!ratings[field] || ratings[field] < 1 || ratings[field] > 5) {
        return res.status(400).json({
          success: false,
          message: `Invalid rating for ${field}. Must be between 1 and 5.`
        });
      }
    }

    // Save the feedback
    const feedback = new Feedback({
      studentId,
      trainerId,
      courseId,
      batchId,
      ratings,
      comments,
      week,
      createdBy: studentId
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback
    });
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// {
//   "trainerId": "12345",
//   "courseId": "67890",
//   "batchId": "11223",
//   "ratings": {
//     "knowledge": 4,
//     "communication": 5,
//     "punctuality": 3
//   },
//   "comments": "Great instructor, but sometimes late to class.",
//   "week": 3
// }

exports.viewMyFeedbacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find({ 
      studentId: req.user.id,
      isActive: true 
    })
    .populate('trainerId', 'name email subject')
    .populate('courseId', 'name description')
    .populate('batchId', 'batchName startDate')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Feedback.countDocuments({ 
      studentId: req.user.id,
      isActive: true 
    });

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("View Feedbacks Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};
