const Trainer=require("../models/trainerModel")
const User = require("../models/usermodel");
const Course=require("../models/courseModel")
const Batch=require("../models/batchModel")
const Feedback=require("../models/feedbackModel")
const bcrypt = require("bcryptjs");
const StudentCourseBatch=require("../models/studentcoursemodel")


// Add User
exports.addUser = async (req, res) => {
  console.log("hai")
  try {
    console.log(req.user)
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    console.log(req.body)
    const { name, email, password, role } = req.body;
    if (!["student", "trainer"].includes(role)) return res.status(400).json({ message: "Invalid role" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, createdBy: req.user.id });
    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
// View User
exports.viewUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

exports.listUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

//addtraner


//addCourse

exports.addCourse=async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    console.log(req.body)
    const{name,description,duration}=req.body
    const course = new Course({ name,description,duration, createdBy: req.user.id });
    await course.save();
    res.status(201).json({ message: "Course added successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}


// View Course
exports.viewCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Update Course
exports.updateCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

//addbatch

// exports.addBatch=async (req, res) => {
//   try {
//     if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    
//     const { courseId, batchName, startDate, trainerId } = req.body;
//     const batch = new Batch({ courseId, batchName, startDate, trainerId, 
//       createdBy: req.user.id });
//     await batch.save();
//     res.status(201).json({ message: "Batch added successfully", batch });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// // }
// exports.addBatch = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

//     // Destructure incoming data
//     const { courseId, batchName, startDate, trainerId } = req.body;

//     // Validate course and trainer existence
//     const course = await Course.findById(courseId);
//     const trainer = await Trainer.findById(trainerId);
    
//     if (!course) {
//       return res.status(400).json({ message: "Invalid Course ID" });
//     }

//     if (!trainer) {
//       return res.status(400).json({ message: "Invalid Trainer ID" });
//     }

//     // Create a new batch
//     const batch = new Batch({
//       courseId,
//       batchName,
//       startDate,
//       trainerId,
//       createdBy: req.user.id
//     });

//     await batch.save();

//     return res.status(201).json({ message: "Batch added successfully", batch });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
exports.addBatch = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Destructure incoming data
    const { courseId, batchName, startDate, trainerId } = req.body;

    // Validate course existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: "Invalid Course ID" });
    }

    // Validate trainer existence in User model with role "trainer"
    const trainer = await User.findOne({ _id: trainerId, role: "trainer" });
    if (!trainer) {
      return res.status(400).json({ message: "Invalid Trainer ID or Trainer does not exist" });
    }

    // Create a new batch
    const batch = new Batch({
      courseId,
      batchName,
      startDate,
      trainerId,
      createdBy: req.user.id
    });

    await batch.save();

    return res.status(201).json({ message: "Batch added successfully", batch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// New route to fetch available trainers and courses for dropdown
exports.getAvailableOptions = async (req, res) => {
  try {
    const trainers = await User.findOne({role: "trainer" });
    const courses = await Course.find();  // Get all courses

    return res.status(200).json({ trainers, courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// List all Batches with trainer name and course name populated
// exports.listBatches = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

//     // Fetch all batches and populate trainerId and courseId with their respective names
//     const batches = await Batch.find()
//       .populate('trainerId', 'name')  // Populate trainer's name
//       .populate('courseId', 'name')   // Populate course's name
//       .lean();  // .lean() returns plain JavaScript objects instead of Mongoose documents

//     res.json({ batches });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

exports.listBatches = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch all batches and populate trainerId and courseId with their respective names
    const batches = await Batch.find()
      .populate('trainerId', 'name')  // Populate trainer's name
      .populate('courseId', 'name')   // Populate course's name
      .lean();  // .lean() returns plain JavaScript objects instead of Mongoose documents

    // Return the batches in the response
    res.status(200).json({ success: true, batches });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// View a single Batch with trainer and course names populated
exports.viewBatch = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const batch = await Batch.findById(req.params.id)
      .populate('trainerId', 'name')  // Populate trainer's name
      .populate('courseId', 'name');  // Populate course's name

    if (!batch) return res.status(404).json({ message: "Batch not found" });

    res.json({ batch });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Update Batch
exports.updateBatch = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    res.json({ message: "Batch updated successfully", batch });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Batch
exports.deleteBatch = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    res.json({ message: "Batch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// List all Users


// List all Trainers

// List all Courses
exports.listCourses = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const courses = await Course.find();
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// List all Batches
// exports.listBatches = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

//     const batches = await Batch.find();
//     res.json({ batches });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

//batch allocation regarding

// adminController.js - Add these new functions

// Allocate batch to student
// exports.allocateStudentToBatch = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ 
//         success: false,
//         message: "Access denied. Only admin can allocate batches." 
//       });
//     }

//     const { studentId, courseId, batchId,trainerId } = req.body;

//     // Validate if all required fields exist
//     if (!studentId || !courseId || !batchId || trainerId) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide studentId, courseId and batchId"
//       });
//     }

//     // Check if student exists and is indeed a student
//     const student = await User.findOne({ _id: studentId, role: "student" });
//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found"
//       });
//     }

//     // Check if course exists
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found"
//       });
//     }

//     // Check if batch exists
//     const batch = await Batch.findById(batchId);
//     if (!batch) {
//       return res.status(404).json({
//         success: false,
//         message: "Batch not found"
//       });
//     }
//     const trainer = await Trainer.findById(trainerId);
//     if (!trainer) {
//       return res.status(404).json({
//         success: false,
//         message: "trainer not found"
//       });
//     }

//     // Check if student is already allocated to this batch
//     const existingAllocation = await StudentCourseBatch.findOne({
//       studentId,
//       courseId,
//       batchId,
//       trainerId,
//       isActive: true
//     });

//     if (existingAllocation) {
//       return res.status(400).json({
//         success: false,
//         message: "Student is already allocated to this batch"
//       });
//     }

//     // Create new allocation
//     const allocation = new StudentCourseBatch({
//       studentId,
//       courseId,
//       batchId,
//       trainerId,
//       createdBy: req.user.id
//     });

//     await allocation.save();

//     // Fetch complete details for response
//     const completeAllocation = await StudentCourseBatch.findById(allocation._id)
//       .populate('studentId', 'name email')
//       .populate('courseId', 'name description')
//       .populate('batchId', 'batchName startDate')
//       .populate('trainerId', 'trainerName')

//       .lean();

//     return res.status(201).json({
//       success: true,
//       message: "Student successfully allocated to batch",
//       data: completeAllocation
//     });

//   } catch (error) {
//     console.error("Batch Allocation Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error allocating student to batch",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };
// adminController.js

// Allocate student to a batch


exports.allocateStudentToBatch = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const { studentId, courseId, batchId, trainerId } = req.body;

    // Validate if all required fields exist
    if (!studentId || !courseId || !batchId || !trainerId) {
      return res.status(400).json({ message: "Please provide studentId, courseId, batchId, and trainerId" });
    }

    const student = await User.findOne({ _id: studentId, role: "student" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    const trainer = await User.find({ role: "trainer",_id:trainerId});
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    const existingAllocation = await StudentCourseBatch.findOne({
      studentId,
      courseId,
      batchId,
      trainerId,
      isActive: true
    });

    if (existingAllocation) {
      return res.status(400).json({ message: "Student already allocated to this batch" });
    }

    const allocation = new StudentCourseBatch({
      studentId,
      courseId,
      batchId,
      trainerId,
      createdBy: req.user.id
    });

    await allocation.save();
    const completeAllocation = await StudentCourseBatch.findById(allocation._id)
      .populate("studentId", "name email")
      .populate("courseId", "name description")
      .populate("batchId", "batchName startDate")
      .populate("trainerId", "trainerName")
      .lean();

    res.status(201).json({
      success: true,
      message: "Student allocated successfully",
      data: completeAllocation
    });
  } catch (error) {
    console.error("Batch Allocation Error:", error);
    res.status(500).json({ message: "Error allocating student to batch", error });
  }
};



// Remove student from batch
// exports.removeStudentFromBatch = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. Only admin can remove batch allocations."
//       });
//     }

//     const { allocationId } = req.params;

//     const allocation = await StudentCourseBatch.findById(allocationId);
//     if (!allocation) {
//       return res.status(404).json({
//         success: false,
//         message: "Batch allocation not found"
//       });
//     }

//     // Soft delete by setting isActive to false
//     allocation.isActive = false;
//     allocation.updatedBy = req.user.id;
//     await allocation.save();

//     return res.status(200).json({
//       success: true,
//       message: "Student successfully removed from batch"
//     });

//   } catch (error) {
//     console.error("Remove from Batch Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error removing student from batch",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// List all allocations (for admin)
// exports.listBatchAllocations = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. Only admin can view all allocations."
//       });
//     }

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const allocations = await StudentCourseBatch.find({ isActive: true })
//       .populate('studentId', 'name email')
//       .populate('courseId', 'name description')
//       .populate('batchId', 'batchName startDate')
//       .populate({ path: 'trainerId', select: 'name ', model: User, match: { role: 'trainer' } })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     const total = await StudentCourseBatch.countDocuments({ isActive: true });

//     return res.status(200).json({
//       success: true,
//       data: allocations,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(total / limit),
//         totalItems: total,
//         itemsPerPage: limit
//       }
//     });

//   } catch (error) {
//     console.error("List Allocations Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching batch allocations",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// exports.removeStudentFromBatch = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. Only admin can remove batch allocations."
//       });
//     }

//     const { allocationId } = req.params;

//     // Validate allocationId
//     if (!allocationId) {
//       return res.status(400).json({
//         success: false,
//         message: "Allocation ID is required"
//       });
//     }

//     // Check if allocation exists and is active
//     const allocation = await StudentCourseBatch.findOne({
//       _id: allocationId,
//       isActive: true
//     });

//     if (!allocation) {
//       return res.status(404).json({
//         success: false,
//         message: "Active batch allocation not found"
//       });
//     }

//     // Soft delete by setting isActive to false
//     allocation.isActive = false;
//     allocation.updatedBy = req.user._id; // Changed from req.user.id to req.user._id
//     allocation.updatedAt = new Date(); // Add timestamp for the update
//     await allocation.save();

//     return res.status(200).json({
//       success: true,
//       message: "Student successfully removed from batch"
//     });

//   } catch (error) {
//     console.error("Remove from Batch Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error removing student from batch",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// exports.listBatchAllocations = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. Only admin can view all allocations."
//       });
//     }

//     const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensure page is at least 1
//     const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100); // Limit between 1 and 100
//     const skip = (page - 1) * limit;

//     // Add filter options
//     const filter = { isActive: true };
    
//     // Add optional filters if provided in query
//     if (req.query.courseId) filter.courseId = req.query.courseId;
//     if (req.query.batchId) filter.batchId = req.query.batchId;
//     if (req.query.trainerId) filter.trainerId = req.query.trainerId;

//     // Add sort options
//     const sort = { createdAt: -1 }; // Default sort by creation date, newest first

//     const allocations = await StudentCourseBatch.find(filter)
//       .populate('studentId', 'name email')
//       .populate('courseId', 'name description')
//       .populate('batchId', 'batchName startDate endDate') // Added endDate
//       .populate('trainerId', 'trainerName email subject') // Changed name to trainerName for consistency
//       .populate('createdBy', 'name email')
//       .populate('updatedBy', 'name email')
//       .sort(sort)
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     const total = await StudentCourseBatch.countDocuments(filter);

//     return res.status(200).json({
//       success: true,
//       data: allocations,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(total / limit),
//         totalItems: total,
//         itemsPerPage: limit,
//         hasNextPage: page * limit < total,
//         hasPreviousPage: page > 1
//       }
//     });

//   } catch (error) {
//     console.error("List Allocations Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching batch allocations",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

exports.listBatchAllocations = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can view all allocations."
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const allocations = await StudentCourseBatch.find({ isActive: true })
      .populate("studentId", "name email")
      .populate("courseId", "name description")
      .populate("batchId", "batchName startDate")
      .populate({ path: "trainerId", select: "name", model: User, match: { role: "trainer" } })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await StudentCourseBatch.countDocuments({ isActive: true });

    return res.status(200).json({
      success: true,
      data: allocations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("List Allocations Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching batch allocations",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

exports.removeBatchAllocation = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can remove allocations."
      });
    }

    const { id } = req.params;
    console.log(id)
    const allocation = await StudentCourseBatch.findById(id);
    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found."
      });
    }

    await StudentCourseBatch.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Batch allocation removed successfully."
    });
  } catch (error) {
    console.error("Remove Allocation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error removing batch allocation",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

//feedback controller

exports.viewAllFeedbacks = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object based on query parameters
    const filter = { isActive: true };
    if (req.query.trainerId) filter.trainerId = req.query.trainerId;
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.query.batchId) filter.batchId = req.query.batchId;
    if (req.query.week) filter.week = req.query.week;

    const feedbacks = await Feedback.find(filter)
      .populate('studentId', 'name email')
      .populate('trainerId', 'name email subject')
      .populate('courseId', 'name description')
      .populate('batchId', 'batchName startDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments(filter);

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
    console.error("View All Feedbacks Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};



exports.getTrainers = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const trainers = await User.find({ role: "trainer" });
    res.json(trainers);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getStudents = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const students = await User.find({ role: "student" });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getCourses = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


exports.addTrainer = async (req, res) => {
  try {
    const { name, subject, email } = req.body;
    // const image = req.file ? req.file.path : null;

    const trainer = new User({ name, subject, email, role: "trainer", createdBy: req.user.id });
    await trainer.save();
    res.status(201).json({ message: "Trainer added successfully", trainer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.viewTrainer = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const trainer = await User.findOne({ _id: req.params.id, role: "trainer" });
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    res.json({ trainer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Update Trainer
exports.updateTrainer = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const trainer = await User.findOneAndUpdate({ _id: req.params.id, role: "trainer" }, req.body, { new: true });
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    res.json({ message: "Trainer updated successfully", trainer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Delete Trainer
exports.deleteTrainer = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const trainer = await User.findOneAndDelete({ _id: req.params.id, role: "trainer" });
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    res.json({ message: "Trainer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

exports.listTrainers = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const trainers = await User.find({ role: "trainer" });
    res.json({ trainers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
