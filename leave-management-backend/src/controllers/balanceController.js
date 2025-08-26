// controllers/balanceController.js
const prisma = require('../config/db');

exports.getMyBalance = async (req, res) => {
  const bal = await prisma.leaveBalance.findUnique({ where: { user_id: req.user.user_id } });
  res.json(bal);
};

// HR can adjust (optional)
exports.adjustBalance = async (req, res) => {
  const { user_id, total_leaves } = req.body;
  const updated = await prisma.leaveBalance.upsert({
    where: { user_id: Number(user_id) },
    update: { total_leaves },
    create: { user_id: Number(user_id), total_leaves },
  });
  res.json(updated);
};
