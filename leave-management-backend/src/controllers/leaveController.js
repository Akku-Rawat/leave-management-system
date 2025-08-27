// controllers/leaveController.js

const leaveService = require('../services/leaveService');
const ResponseHelper = require('../utils/responseHelper');

/**
 * Create a new leave request
 */
exports.createLeave = async (req, res) => {
  try {
    const userId = req.user.id;  // Auth middleware se user ID milega
    const leaveData = {
      type: req.body.type,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      duration: req.body.duration,
      reason: req.body.reason,
      emergencyContact: req.body.emergencyContact,
    };

    // Business logic service ko call karo
    const newLeave = await leaveService.createLeaveRequest(leaveData, userId);

    // Success response bhejo
    return ResponseHelper.success(res, newLeave, 'Leave created successfully', 201);
  } catch (error) {
    // Error handle karo
    return ResponseHelper.error(res, error.message);
  }
};

/**
 * Get leaves of logged-in user
 */
exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = {
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    };
    const leaves = await leaveService.getLeavesByUser(userId, filters);
    return ResponseHelper.success(res, leaves, 'Leaves fetched successfully');
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};

/**
 * Update leave status (Approve/Reject) - HR/Boss use karta hai
 */
exports.updateLeaveStatus = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const { status, comment } = req.body;
    const approverId = req.user.id;

    const updatedLeave = await leaveService.updateStatus(leaveId, status, approverId, comment);
    return ResponseHelper.success(res, updatedLeave, `Leave ${status.toLowerCase()} successfully`);
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};

/**
 * Delete leave request (cancel)
 */
exports.deleteLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    await leaveService.deleteLeave(leaveId, req.user.id);
    return ResponseHelper.success(res, null, 'Leave cancelled successfully');
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};
