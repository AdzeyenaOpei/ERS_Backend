const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    reviewPeriod: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    ratings: {
        productivity: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        communication: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        teamwork: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        punctuality: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    },
    goals: [{
        description: String,
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed', 'cancelled'],
            default: 'pending'
        }
    }],
    comments: {
        type: String
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    reviewDate: {
        type: Date,
        default: Date.now
    }
});

// Calculate average rating
PerformanceSchema.virtual('averageRating').get(function() {
    const ratings = this.ratings;
    const sum = Object.values(ratings).reduce((a, b) => a + b, 0);
    return (sum / Object.keys(ratings).length).toFixed(2);
});

const Performance = mongoose.model('Performance', PerformanceSchema);

module.exports = Performance; 