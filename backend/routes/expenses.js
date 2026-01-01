const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/expenses
// @desc    Get expenses with optional date filtering
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = { user: req.user };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) {
                // Set endDate to end of that day
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        const expenses = await Expense.find(query).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/expenses/:id
// @desc    Get single expense by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        // Make sure user owns expense
        if (expense.user.toString() !== req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    try {
        const newExpense = new Expense({
            title,
            amount,
            category,
            description,
            date,
            user: req.user
        });

        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    // Build expense object
    const expenseFields = {};
    if (title) expenseFields.title = title;
    if (amount) expenseFields.amount = amount;
    if (category) expenseFields.category = category;
    if (description) expenseFields.description = description;
    if (date) expenseFields.date = date;

    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        // Make sure user owns expense
        if (expense.user.toString() !== req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { $set: expenseFields },
            { new: true }
        );

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        // Make sure user owns expense
        if (expense.user.toString() !== req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Expense.findByIdAndDelete(req.params.id);

        res.json({ message: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
