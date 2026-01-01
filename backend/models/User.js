const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: ''
  },
  currency: {
    type: String,
    default: 'INR'
  },
  theme: {
    type: String,
    default: 'light',
    enum: ['light', 'dark', 'auto']
  },
  defaultCategory: {
    type: String,
    default: 'Other'
  },
  pushNotificationsEnabled: {
    type: Boolean,
    default: true
  },
  monthlyNotificationsEnabled: {
    type: Boolean,
    default: true
  },
  budgetAlertEnabled: {
    type: Boolean,
    default: true
  },
  monthlyBudget: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
