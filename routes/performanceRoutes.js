const express = require('express');
const router = express.Router();
const {
    createPerformanceReview,
    updateGoals,
    getPerformanceHistory,
    getPerformanceStats
} = require('../controllers/performanceController');

// Performance routes
router.post('/review', createPerformanceReview);
router.put('/goals/:performanceId', updateGoals);
router.get('/history/:employeeId', getPerformanceHistory);
router.get('/stats/:employeeId', getPerformanceStats);

module.exports = router; 