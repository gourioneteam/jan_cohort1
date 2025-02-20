const mongoose=require('mongoose')
const masterSchema=require('./mastermodel')

const trainerSchema = new mongoose.Schema({
    ...masterSchema.obj, // Inherit the fields from Master Schema
    name: { type: String, required: true },
    subject: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // image: { type: String }, // Image field added

  });
  
  module.exports = mongoose.model('Trainer', trainerSchema);
  