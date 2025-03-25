const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

// @route   GET api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), getUsers);

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getUserProfile);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateUserProfile);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private (Admin only)
router.get('/:id', protect, authorize('admin'), getUserById);

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), updateUser);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
