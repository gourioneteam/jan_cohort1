const Feedback = require('../models/feedbackModel');
const StudentCourseBatch = require('../models/studentcoursemodel');
const User = require('../models/usermodel');
const Course = require('../models/courseModel');
const Batch = require('../models/batchModel');
const Trainer = require('../models/trainerModel');
const mongoose=require('mongoose')

exports.viewTrainerStudents = async (req, res) => {
    try {
      if (req.user.role !== 'trainer') {
        return res.status(403).json({ 
          success: false,
          message: "Access denied" 
        });
      }
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const batches = await Batch.find({ 
        trainerId: req.user.id,
        isActive: true 
      });
  
      const batchIds = batches.map(batch => batch._id);
  
      const students = await StudentCourseBatch.find({
        batchId: { $in: batchIds },
        isActive: true
      })
      .populate('studentId', 'name email')
      .populate('courseId', 'name description')
      .populate('batchId', 'batchName startDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  
      const total = await StudentCourseBatch.countDocuments({
        batchId: { $in: batchIds },
        isActive: true
      });
  
      res.json({
        success: true,
        data: students,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      console.error("View Trainer Students Error:", error);
      res.status(500).json({ 
        success: false,
        message: "Server error",
        error: error.message 
      });
    }
  };


  exports.viewTrainerFeedbacks = async (req, res) => {
    try {
      // Ensure the user is a trainer
      if (req.user.role !== 'trainer') {
        return res.status(403).json({ 
          success: false,
          message: "Access denied" 
        });
      }
  
      // Pagination setup
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Filtering criteria
      const filter = { 
        trainerId: new mongoose.Types.ObjectId(req.user.id), 
        isActive: true 
      };
      if (req.query.courseId) filter.courseId = new mongoose.Types.ObjectId(req.query.courseId);
      if (req.query.batchId) filter.batchId = new mongoose.Types.ObjectId(req.query.batchId);
      if (req.query.week) filter.week = parseInt(req.query.week);
  
      // Fetch feedback data
      const feedbacks = await Feedback.find(filter)
        .populate('studentId', 'name email')
        .populate('courseId', 'name description')
        .populate('batchId', 'batchName startDate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      // Count total feedbacks
      const total = await Feedback.countDocuments(filter);
  
      // Debugging: Check if data exists
      console.log("Feedback Data Before Aggregation:", feedbacks);
  
      // Aggregate ratings (only if feedbacks exist)
      const aggregatedRatings = await Feedback.aggregate([
        { 
          $match: { 
            trainerId: new mongoose.Types.ObjectId(req.user.id), 
            isActive: true,
            "ratings.knowledge": { $exists: true },
            "ratings.communication": { $exists: true },
            "ratings.punctuality": { $exists: true }
          }
        },
        { 
          $group: {
            _id: null,
            avgKnowledge: { $avg: "$ratings.knowledge" },
            avgCommunication: { $avg: "$ratings.communication" },
            avgPunctuality: { $avg: "$ratings.punctuality" },
            totalFeedbacks: { $sum: 1 }
          }
        }
      ]);
  
      console.log("Aggregated Ratings:", aggregatedRatings);
  
      res.json({
        success: true,
        data: feedbacks,
        statistics: aggregatedRatings[0] || {
          avgKnowledge: 0,
          avgCommunication: 0,
          avgPunctuality: 0,
          totalFeedbacks: 0
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      console.error("View Trainer Feedbacks Error:", error);
      res.status(500).json({ 
        success: false,
        message: "Server error",
        error: error.message 
      });
    }
  };