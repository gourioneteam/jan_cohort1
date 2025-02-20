const mongoose = require('mongoose');
const masterSchema=require('./mastermodel')

const userSchema = new mongoose.Schema({
    ...masterSchema.obj, // Inherit the fields from Master Schema
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'trainer', 'admin'], required: true },
    profileImage: String,
    profileImageUrl: String
  });
  userSchema.pre("save", function (next) {
    if (this.role === "admin") {
      this.createdBy = undefined; // Remove createdBy for admin
    }
    next();
  });
  module.exports = mongoose.model('User', userSchema);
  