// controllers/adminController.js
const prisma = require('../config/db');

exports.summaryReport = async (_req, res) => {
  const [pending, approved, rejected, users] = await Promise.all([
    prisma.leaveRequest.count({ where: { status: 'pending' } }),
    prisma.leaveRequest.count({ where: { status: 'approved' } }),
    prisma.leaveRequest.count({ where: { status: 'rejected' } }),
    prisma.user.count(),
  ]);
  res.json({ pending, approved, rejected, users });
};
