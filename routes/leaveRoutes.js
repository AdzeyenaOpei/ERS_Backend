const express = require('express');
const router = express.Router();
const {
    requestLeave,
    updateLeaveStatus,
    getLeaveHistory,
    getPendingLeaves
} = require('../controllers/leaveController');

// Leave request routes
router.post('/request', requestLeave);
router.put('/status/:leaveId', updateLeaveStatus);
router.get('/history/:employeeId', getLeaveHistory);
router.get('/pending', getPendingLeaves);

module.exports = router; 