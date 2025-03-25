const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  processPayment, 
  getPaymentById, 
  getUserPayments,
  getOrganizerPayments
} = require('../controllers/payments');
const { protect, authorize } = require('../middleware/auth');

// @route   POST api/payments/create-payment-intent
// @desc    Create payment intent with Stripe
// @access  Private
router.post('/create-payment-intent', protect, createPaymentIntent);

// @route   POST api/payments/process
// @desc    Process payment
// @access  Private
router.post('/process', protect, processPayment);

// @route   GET api/payments/user
// @desc    Get payments made by logged in user
// @access  Private
router.get('/user', protect, getUserPayments);

// @route   GET api/payments/organizer
// @desc    Get payments for events created by logged in organizer
// @access  Private (Organizers only)
router.get('/organizer', protect, authorize('organizer'), getOrganizerPayments);

// @route   GET api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', protect, getPaymentById);

module.exports = router;
