const Performance = require('../models/Performance');
const Employee = require('../models/Employee');

// Create performance review
const createPerformanceReview = async (req, res) => {
    const {
        employeeId,
        reviewPeriod,
        ratings,
        goals,
        comments,
        reviewedBy
    } = req.body;

    try {
        // Check if employee exists
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        // Check if reviewer exists and is a manager
        const reviewer = await Employee.findById(reviewedBy);
        if (!reviewer || reviewer.role !== 'Manager') {
            return res.status(403).json({ msg: 'Unauthorized to create performance reviews' });
        }

        // Validate review period
        if (new Date(reviewPeriod.startDate) > new Date(reviewPeriod.endDate)) {
            return res.status(400).json({ msg: 'Start date must be before end date' });
        }

        const performance = new Performance({
            employeeId,
            reviewPeriod,
            ratings,
            goals,
            comments,
            reviewedBy
        });

        await performance.save();

        res.status(201).json({
            msg: 'Performance review created successfully',
            performance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update performance goals
const updateGoals = async (req, res) => {
    const { performanceId } = req.params;
    const { goals } = req.body;

    try {
        const performance = await Performance.findById(performanceId);
        if (!performance) {
            return res.status(404).json({ msg: 'Performance review not found' });
        }

        performance.goals = goals;
        await performance.save();

        res.json({
            msg: 'Goals updated successfully',
            performance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get employee's performance history
const getPerformanceHistory = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const performances = await Performance.find({ employeeId })
            .populate('reviewedBy', 'email role')
            .sort({ reviewDate: -1 });

        res.json(performances);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get performance statistics
const getPerformanceStats = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const performances = await Performance.find({ employeeId });
        
        if (performances.length === 0) {
            return res.status(404).json({ msg: 'No performance reviews found' });
        }

        // Calculate average ratings over time
        const stats = {
            averageRatings: {
                productivity: 0,
                communication: 0,
                teamwork: 0,
                punctuality: 0
            },
            totalReviews: performances.length,
            completedGoals: 0,
            pendingGoals: 0
        };

        performances.forEach(perf => {
            // Sum up ratings
            Object.keys(perf.ratings).forEach(key => {
                stats.averageRatings[key] += perf.ratings[key];
            });

            // Count goals by status
            perf.goals.forEach(goal => {
                if (goal.status === 'completed') {
                    stats.completedGoals++;
                } else if (goal.status === 'pending' || goal.status === 'in-progress') {
                    stats.pendingGoals++;
                }
            });
        });

        // Calculate averages
        Object.keys(stats.averageRatings).forEach(key => {
            stats.averageRatings[key] = (
                stats.averageRatings[key] / performances.length
            ).toFixed(2);
        });

        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = {
    createPerformanceReview,
    updateGoals,
    getPerformanceHistory,
    getPerformanceStats
}; 