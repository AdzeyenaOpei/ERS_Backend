const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dateOfBirth: {
        type: String,
    },
    residence: {
        type: String,
    },
    attendance: {
        type: Array, // Array of dates the employee attended
        default: [],
    },
    role: {
        type: String,
        default: 'Employee',
    },
    department: {
        type: String,
    },
    salary: {
        type: Number,

    },
    dateOfJoining: {
        type: Date,
        default: Date.now,
    },
    phoneNumber: {
        type: String,
    },
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
