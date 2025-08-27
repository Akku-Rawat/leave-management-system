// routes/balanceRoutes.js
const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getMyBalance, adjustBalance } = require('../controllers/balanceController');

router.get('/me', protect, authorize('employee', 'hr', 'boss'), getMyBalance);
router.post('/adjust', protect, authorize('hr', 'boss'), adjustBalance);

module.exports = router;
