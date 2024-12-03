const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

// Register new employee
const registerEmployee = async (req, res) => {
    const { email, password, role, department, salary, phoneNumber, dateOfBirth, residence } = req.body;

    try {
        let employee = await Employee.findOne({ email });
        if (employee) {
            return res.status(400).json({ msg: 'Employee already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        employee = new Employee({
            email,
            password: hashedPassword,
            role,
            department,
            salary: parseInt(salary),
            phoneNumber,
            dateOfBirth,
            residence
        });

        await employee.save();
        
        res.status(201).json({ 
            msg: 'Employee registered successfully',
            employee: {
                id: employee._id,
                email: employee.email,
                role: employee.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Login employee
const loginEmployee = async (req, res) => {
    const { email, password } = req.body;
    console.log(`email: ${email}, password: ${password}`);

    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            console.log(`Employee not found: ${email}`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            console.log(`Invalid credentials: ${email}`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        console.log(`Login successful: ${email}`);
        res.json({
            msg: 'Login successful',
            employee: {
                id: employee._id,
                email: employee.email,
                role: employee.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get employee profile
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).select('-password');
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).select('-password');
        
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        
        res.json(employee);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all managers
const getManagers = async (req, res) => {
    try {
        const managers = await Employee.find({ role: 'HR Manager' })
            .select('email department') // Only return necessary fields
            .sort({ email: 1 });

        if (managers.length === 0) {
            return res.status(404).json({ msg: 'No managers found' });
        }

        res.json(managers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { 
    registerEmployee, 
    loginEmployee, 
    getEmployeeById,
    updateEmployee,
    getManagers
}; 