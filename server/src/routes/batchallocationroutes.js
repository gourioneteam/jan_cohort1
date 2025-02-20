// routes/batchAllocationRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controller/admincontroller");
const authMiddleware = require("../middleware/auth");

// Batch allocation routes
router.post(  "/allocate-batch",   authMiddleware,   adminController.allocateStudentToBatch
);
// Remove student from batch
router.delete(  "/remove-allocation/:id",   authMiddleware, 
  adminController.removeBatchAllocation
);

// View all batch allocations (with pagination)
router.get("/batch-allocations",authMiddleware,adminController.listBatchAllocations);

// Optionally get allocations for a specific student
router.get(  "/student-allocations/:studentId", 
  authMiddleware, 
  adminController.listBatchAllocations
);

module.exports = router;

