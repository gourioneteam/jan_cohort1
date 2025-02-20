const mongoose = require('mongoose');
const masterSchema = require('./mastermodel');

const studentCourseBatchSchema = new mongoose.Schema({
  ...masterSchema.obj, // Inherit the fields from Master Schema
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Ensuring trainerId defaults to null if not assigned
});

module.exports = mongoose.model('StudentCourseBatch', studentCourseBatchSchema);
