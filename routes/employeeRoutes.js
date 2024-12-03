const express = require('express');
const router = express.Router();
const { 
    registerEmployee, 
    loginEmployee, 
    getEmployeeById,
    updateEmployee,
    getManagers
} = require('../controllers/employeeController');

router.get('/managers', getManagers);
router.post('/register', registerEmployee);
router.post('/login', loginEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);

module.exports = router; 