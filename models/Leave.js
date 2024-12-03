const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['sick', 'vacation', 'personal', 'other'],
        required: true
    },
    requestDate: {
        type: Date,
        default: Date.now
    }
});

const Leave = mongoose.model('Leave', LeaveSchema);

module.exports = Leave; 