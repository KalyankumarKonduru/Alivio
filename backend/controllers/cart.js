const Cart = require('../models/Cart');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    // Find cart for user or create a new one
    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.ticket',
        select: 'type price description'
      })
      .populate({
        path: 'items.event',
        select: 'title date venue'
      });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
        totalAmount: 0
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { ticket, event, quantity, price } = req.body;

    if (!ticket || !event || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Find cart or create a new one
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
        totalAmount: 0
      });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(item => item.ticket.toString() === ticket);

    // If item exists, update quantity
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = price * quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        ticket,
        event,
        quantity,
        price,
        subtotal: price * quantity
      });
    }

    // Calculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => total + item.subtotal, 0);

    // Save cart
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:ticketId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Filter out the item to be removed
    cart.items = cart.items.filter(item => item.ticket.toString() !== req.params.ticketId);

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => total + item.subtotal, 0);

    // Save cart
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:ticketId
// @access  Private
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quantity'
      });
    }

    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item.ticket.toString() === req.params.ticketId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Update quantity and subtotal
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].subtotal = cart.items[itemIndex].price * quantity;

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => total + item.subtotal, 0);

    // Save cart
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Clear items and reset total
    cart.items = [];
    cart.totalAmount = 0;

    // Save cart
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};