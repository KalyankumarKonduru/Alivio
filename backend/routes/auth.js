const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a user or organizer
// @access  Public
router.post('/register', register); // Fixed

// @route   POST api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', login);

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logout);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getCurrentUser);

module.exports = router;