const mongoose=require('mongoose')
const masterSchema=require('./mastermodel')

const feedbackSchema = new mongoose.Schema({
    ...masterSchema.obj, // Inherit the fields from Master Schema
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    ratings: {
      knowledge: { type: Number, min: 1, max: 5, required: true },
      communication: { type: Number, min: 1, max: 5, required: true },
      punctuality: { type: Number, min: 1, max: 5, required: true },
    },
    comments: { type: String },
    week: { type: String, required: true }, // e.g., '2024-W01'
  });
  
  module.exports = mongoose.model('Feedback', feedbackSchema);
  