const mongoose=require('mongoose')
const masterSchema=require('./mastermodel')

const courseSchema = new mongoose.Schema({
    ...masterSchema.obj, // Inherit the fields from Master Schema
    name: { type: String, required: true },
    description: { type: String },
    duration: { type: String }, // e.g., "6 months"
  });
  
  module.exports = mongoose.model('Course', courseSchema);
  