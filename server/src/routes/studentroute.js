// routes/studentroute.js
const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentController")
const authMiddleware = require("../middleware/auth");
const { uploadMiddleware } = require("../config/cloudianryconfig");

// Authentication Routes
router.post("/register", authMiddleware, studentController.registerStudent);
router.post("/login", studentController.loginStudent);

// Password and Profile Management
router.put("/change-password", authMiddleware, studentController.changePassword);
router.put("/update-profile", authMiddleware, studentController.updateProfile);
router.get("/profile", authMiddleware, studentController.viewProfile);
router.post(
  "/upload-profile", 
  authMiddleware, 
  uploadMiddleware.single("profileImage"), 
  studentController.uploadProfileImage
);

// Feedback Routes
router.post("/submit-feedback", authMiddleware, studentController.submitFeedback);

// // Batch Details Routes
router.get("/batch-details", authMiddleware, studentController.viewBatchDetails);
// router.get("/batch-details/:id", authMiddleware, studentController.viewBatchDetails);

router.get("/feedback", authMiddleware, studentController.submitFeedback);



module.exports = router;

//npm uninstall cloudinary
//npm install cloudinary@1.40.0 multer-storage-cloudinary --legacy-peer-deps