const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Record check-in
const checkIn = async (req, res) => {
    const { employeeId } = req.body;

    try {
        // Check if employee exists
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        // Check if already checked in today
        const existingAttendance = await Attendance.findOne({
            employeeId,
            date: {
                $gte: new Date().setHours(0, 0, 0, 0),
                $lt: new Date().setHours(23, 59, 59, 999)
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ msg: 'Already checked in today' });
        }

        const attendance = new Attendance({
            employeeId,
            checkInTime: new Date().toLocaleTimeString()
        });

        await attendance.save();

        // Update employee's attendance array
        employee.attendance.push(attendance.date);
        await employee.save();

        res.status(201).json({
            msg: 'Check-in recorded successfully',
            attendance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Record check-out
const checkOut = async (req, res) => {
    const { employeeId } = req.body;

    try {
        // Find today's attendance record
        const attendance = await Attendance.findOne({
            employeeId,
            date: {
                $gte: new Date().setHours(0, 0, 0, 0),
                $lt: new Date().setHours(23, 59, 59, 999)
            },
            checkOutTime: { $exists: false }
        });

        if (!attendance) {
            return res.status(400).json({ msg: 'No active check-in found for today' });
        }

        attendance.checkOutTime = new Date().toLocaleTimeString();
        await attendance.save();

        res.json({
            msg: 'Check-out recorded successfully',
            attendance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get attendance history for an employee
const getAttendanceHistory = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const attendance = await Attendance.find({ employeeId })
            .sort({ date: -1 }); // Sort by date in descending order

        res.json(attendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get today's attendance for an employee
const getTodayAttendance = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const attendance = await Attendance.findOne({
            employeeId,
            date: {
                $gte: new Date().setHours(0, 0, 0, 0),
                $lt: new Date().setHours(23, 59, 59, 999)
            }
        });

        if (!attendance) {
            return res.status(404).json({ msg: 'No attendance record found for today' });
        }

        res.json(attendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = {
    checkIn,
    checkOut,
    getAttendanceHistory,
    getTodayAttendance
}; 