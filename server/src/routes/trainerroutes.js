const express = require('express');
const router = express.Router();
const { viewTrainerStudents, viewTrainerFeedbacks } = require('../controller/trainerController');
const authMiddleware = require('../middleware/auth'); // Middleware to verify token and role

// Route to fetch students assigned to a trainer
router.get('/students', authMiddleware, viewTrainerStudents);

// Route to fetch feedback related to a trainer
router.get('/feedbacks', authMiddleware, viewTrainerFeedbacks);

module.exports = router;
