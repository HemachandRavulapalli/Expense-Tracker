const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/expenses
// @desc    Get all expenses with filtering, sorting, and pagination
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            sort = 'date',
            order = 'desc',
            search,
            category,
            startDate,
            endDate,
            minAmount,
            maxAmount
        } = req.query;

        const query = { user: req.user._id }; // Ensure we use req.user._id if middleware attaches full user doc

        // Filtering
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = Number(minAmount);
            if (maxAmount) query.amount.$lte = Number(maxAmount);
        }

        // Sorting
        const sortOptions = {};
        sortOptions[sort] = order === 'asc' ? 1 : -1;

        // Pagination
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const expenses = await Expense.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const total = await Expense.countDocuments(query);

        res.json({
            success: true,
            data: expenses,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/expenses/summary
// @desc    Get expense summary (totals, breakdown)
// @access  Private
router.get('/summary', protect, async (req, res) => {
    try {
        const { period = 'month', date } = req.query;
        const userId = req.user._id;

        // Define date range based on period
        let startDate, endDate;
        const now = date ? new Date(date) : new Date();

        if (period === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        } else if (period === 'year') {
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        } else {
            // All time placeholder, or default to month
            startDate = new Date(0); // Beginning of epoch
            endDate = new Date();
        }

        // Aggregation Pipeline
        const stats = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: '$amount' },
                    totalCount: { $sum: 1 },
                    avgAmount: { $avg: '$amount' }
                }
            }
        ]);

        const categoryStats = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalSpent = stats.length > 0 ? stats[0].totalSpent : 0;

        // Format category breakdown
        const categoryBreakdown = {};
        categoryStats.forEach(stat => {
            categoryBreakdown[stat._id] = {
                total: stat.total,
                count: stat.count,
                percentage: totalSpent > 0 ? (stat.total / totalSpent * 100).toFixed(2) : 0
            };
        });

        res.json({
            success: true,
            summary: {
                totalSpent,
                totalCount: stats.length > 0 ? stats[0].totalCount : 0,
                averagePerTransaction: stats.length > 0 ? stats[0].avgAmount : 0,
                categoryBreakdown
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/expenses/analytics
// @desc    Get advanced analytics for charts
// @access  Private
router.get('/analytics', protect, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user._id;

        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();

        // daily totals for line chart
        const dailyTotals = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            analytics: {
                dailyTotals: dailyTotals.map(d => ({ date: d._id, total: d.total })),
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   POST /api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, amount, category, description, date, time } = req.body;

        const newExpense = await Expense.create({
            title,
            amount,
            category,
            description,
            date, // Frontend sends ISO string
            time,
            user: req.user._id
        });

        res.status(201).json({ success: true, expense: newExpense });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/expenses/:id
// @desc    Get single expense
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ success: false, error: 'Expense not found' });

        // Check ownership
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        res.json({ success: true, expense });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ success: false, error: 'Expense not found' });

        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, expense });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ success: false, error: 'Expense not found' });

        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await expense.deleteOne();
        res.json({ success: true, message: 'Expense removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
