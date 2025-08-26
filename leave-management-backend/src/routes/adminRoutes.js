// routes/adminRoutes.js
const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { summaryReport } = require('../controllers/adminController');

router.get('/report', protect, authorize('boss', 'hr'), summaryReport);

module.exports = router;
