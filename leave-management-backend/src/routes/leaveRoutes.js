const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const leaveController = require('../controllers/leaveController');

router.get('/', authenticateToken, leaveController.getLeaveRecords);
router.post('/', authenticateToken, leaveController.createLeaveRecord);
router.put('/:id', authenticateToken, leaveController.updateLeaveRecord);
router.delete('/:id', authenticateToken, leaveController.deleteLeaveRecord);

module.exports = router;
