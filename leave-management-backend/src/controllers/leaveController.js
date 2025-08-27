const LeaveRequest = require('../models/Leave');

exports.getLeaves = async (req, res) => {
  const leaves = await LeaveRequest.findAll();
  res.json(leaves);
};

exports.createLeave = async (req, res) => {
  const leave = await LeaveRequest.create(req.body);
  res.json(leave);
};
