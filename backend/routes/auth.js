const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                console.log('Protect Middleware: User not found in DB for ID:', decoded.id);
                return res.status(401).json({ message: 'User no longer exists' });
            }
            return next();
        } catch (error) {
            console.error('Protect Middleware JWT Error:', error.message);
            return res.status(401).json({ message: 'Token invalid or expired' });
        }
    }
    if (!token) {
        console.log('Protect Middleware: No token provided in headers');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            user,
            token: generateToken(user._id)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const {
            name,
            email,
            currency,
            theme,
            defaultCategory,
            pushNotificationsEnabled,
            monthlyNotificationsEnabled,
            budgetAlertEnabled,
            monthlyBudget,
            categoryBudgets
        } = req.body;

        const user = await User.findById(req.user.id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            if (currency) user.currency = currency;
            if (theme) user.theme = theme;
            if (defaultCategory) user.defaultCategory = defaultCategory;
            if (pushNotificationsEnabled !== undefined) user.pushNotificationsEnabled = pushNotificationsEnabled;
            if (monthlyNotificationsEnabled !== undefined) user.monthlyNotificationsEnabled = monthlyNotificationsEnabled;
            if (budgetAlertEnabled !== undefined) user.budgetAlertEnabled = budgetAlertEnabled;
            if (monthlyBudget !== undefined) user.monthlyBudget = monthlyBudget;
            if (categoryBudgets !== undefined) user.categoryBudgets = categoryBudgets;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                currency: updatedUser.currency,
                theme: updatedUser.theme,
                monthlyBudget: updatedUser.monthlyBudget,
                categoryBudgets: updatedUser.categoryBudgets,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });

        user.password = newPassword; // Will be hashed by pre-save middleware
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password
        });

        await user.save();

        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, theme: user.theme, currency: user.currency, monthlyBudget: user.monthlyBudget, categoryBudgets: user.categoryBudgets } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
