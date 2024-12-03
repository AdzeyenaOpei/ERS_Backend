const express = require('express');
const router = express.Router();
const {
    checkIn,
    checkOut,
    getAttendanceHistory,
    getTodayAttendance
} = require('../controllers/attendanceController');

// Record attendance
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);

// Get attendance records
router.get('/history/:employeeId', getAttendanceHistory);
router.get('/today/:employeeId', getTodayAttendance);

module.exports = router; 