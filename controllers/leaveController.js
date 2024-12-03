const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// Request leave
const requestLeave = async (req, res) => {
    const { employeeId, startDate, endDate, reason, type } = req.body;

    try {
        // Check if employee exists
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        // Check if dates are valid
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ msg: 'Start date must be before end date' });
        }

        // Check for overlapping leave requests
        const overlappingLeave = await Leave.findOne({
            employeeId,
            status: { $ne: 'rejected' },
            $or: [
                {
                    startDate: { $lte: startDate },
                    endDate: { $gte: startDate }
                },
                {
                    startDate: { $lte: endDate },
                    endDate: { $gte: endDate }
                }
            ]
        });

        if (overlappingLeave) {
            return res.status(400).json({ msg: 'Overlapping leave request exists' });
        }

        const leave = new Leave({
            employeeId,
            startDate,
            endDate,
            reason,
            type
        });

        await leave.save();

        res.status(201).json({
            msg: 'Leave request submitted successfully',
            leave
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update leave status (for managers/admins)
const updateLeaveStatus = async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body;

    try {
        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ msg: 'Leave request not found' });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        leave.status = status;
        await leave.save();

        res.json({
            msg: `Leave request ${status}`,
            leave
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get employee's leave history
const getLeaveHistory = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const leaves = await Leave.find({ employeeId })
            .sort({ requestDate: -1 });

        res.json(leaves);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all pending leave requests (for managers/admins)
const getPendingLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ status: 'pending' })
            .populate('employeeId', 'email role department')
            .sort({ requestDate: 1 });

        res.json(leaves);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = {
    requestLeave,
    updateLeaveStatus,
    getLeaveHistory,
    getPendingLeaves
}; 