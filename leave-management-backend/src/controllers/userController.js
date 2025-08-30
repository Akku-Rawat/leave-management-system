// controllers/userController.js

const userService = require('../services/userService');
const ResponseHelper = require('../utils/responseHelper');

/**
 * Get logged-in user profile
 * GET /api/users/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await userService.getUserById(userId);
    return ResponseHelper.success(res, userProfile, 'User profile retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};

/**
 * Update logged-in user profile
 * PUT /api/users/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      department: req.body.department,
      phone: req.body.phone,
    };
    const updatedUser = await userService.updateUserProfile(userId, updateData);
    return ResponseHelper.success(res, updatedUser, 'User profile updated successfully');
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};

/**
 * Get list of all employees (for HR and Boss roles)
 * GET /api/users/employees
 */
exports.getEmployees = async (req, res) => {
  try {
    // You may add filters like department or search term from query
    const filters = {
      department: req.query.department,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    };
    const employees = await userService.getEmployeesList(filters);
    return ResponseHelper.success(res, employees, 'Employee list retrieved');
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};

/**
 * Get list of all departments
 * GET /api/users/departments
 */
exports.getDepartments = async (req, res) => {
  try {
    const departments = await userService.getDepartments();
    return ResponseHelper.success(res, departments, 'Departments list retrieved');
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};