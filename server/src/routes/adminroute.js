const express = require("express");
const router = express.Router();
const adminController = require("../controller/admincontroller");
const authMiddleware = require("../middleware/auth");
const{addTrainer}=require('../controller/admincontroller')



router.post("/add-user",authMiddleware,adminController.addUser);
router.post("/add-trainer", authMiddleware,addTrainer);
// Admin - Add Course
router.post("/add-course", authMiddleware, adminController.addCourse);
router.post("/add-batch", authMiddleware, adminController.addBatch);

router.get('/get-available-options',adminController.getAvailableOptions);

// User Routes
router.get("/view-user/:id", authMiddleware, adminController.viewUser); // View user by ID
router.put("/update-user/:id", authMiddleware, adminController.updateUser); // Update user
router.delete("/delete-user/:id", authMiddleware, adminController.deleteUser); // Delete user

// Trainer Routes
router.get("/view-trainer/:id", authMiddleware, adminController.viewTrainer); // View trainer by ID
router.put("/update-trainer/:id", authMiddleware, adminController.updateTrainer); // Update trainer
router.delete("/delete-trainer/:id", authMiddleware, adminController.deleteTrainer); // Delete trainer

// Course Routes
router.get("/view-course/:id", authMiddleware, adminController.viewCourse); // View course by ID
router.put("/update-course/:id", authMiddleware, adminController.updateCourse); // Update course
router.delete("/delete-course/:id", authMiddleware, adminController.deleteCourse); // Delete course

// Batch Routes
router.get("/view-batch/:id", authMiddleware, adminController.viewBatch); // View batch by ID
router.put("/update-batch/:id", authMiddleware, adminController.updateBatch); // Update batch
router.delete("/delete-batch/:id", authMiddleware, adminController.deleteBatch); // Delete batch


router.get("/list-users", authMiddleware, adminController.listUsers);

// List all Trainers
router.get("/list-trainers", authMiddleware, adminController.listTrainers);

// List all Courses
router.get("/list-courses", authMiddleware, adminController.listCourses);

// List all Batches
router.get("/list-batches", authMiddleware, adminController.listBatches);
router.get("/get-students", authMiddleware, adminController.getStudents);
router.get("/get-courses", authMiddleware, adminController.getCourses);  // Fetch courses
router.get("/get-trainers", authMiddleware, adminController.getTrainers);


module.exports = router;
