const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        minlength: 3,
        maxlength: 60
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
        min: 0.01,
        max: 9999999.99
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Education', 'Shopping', 'Rent', 'Other']
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    time: {
        type: String, // HH:mm format
        required: false
    },
    description: {
        type: String,
        maxlength: 500
    },
    tags: {
        type: [String],
        default: []
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Compound indexes for common queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
