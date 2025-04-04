const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart 
} = require('../controllers/cart');
const { protect } = require('../middleware/auth');

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, getCart);

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', protect, addToCart);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', protect, clearCart);

// @route   DELETE /api/cart/:ticketId
// @desc    Remove item from cart
// @access  Private
router.delete('/:ticketId', protect, removeFromCart);

// @route   PUT /api/cart/:ticketId
// @desc    Update cart item quantity
// @access  Private
router.put('/:ticketId', protect, updateCartItemQuantity);

module.exports = router;