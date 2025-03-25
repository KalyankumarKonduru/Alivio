const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

// @desc    Create payment intent with Stripe
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items provided for payment'
      });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const ticket = await Ticket.findById(item.ticket);
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: `Ticket with ID ${item.ticket} not found`
        });
      }
      
      totalAmount += ticket.price * item.quantity;
    }
    
    // Add service fee (e.g., 10%)
    const serviceFee = totalAmount * 0.1;
    totalAmount += serviceFee;
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe requires amount in cents
      currency: 'usd',
      metadata: {
        userId: req.user.id
      }
    });
    
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
exports.processPayment = async (req, res) => {
  try {
    const { paymentIntentId, items } = req.body;
    
    if (!paymentIntentId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID and items are required'
      });
    }
    
    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment has not been completed'
      });
    }
    
    // Calculate total amount and prepare order items
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const ticket = await Ticket.findById(item.ticket);
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: `Ticket with ID ${item.ticket} not found`
        });
      }
      
      const event = await Event.findById(ticket.event);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: `Event not found for ticket ${item.ticket}`
        });
      }
      
      const subtotal = ticket.price * item.quantity;
      totalAmount += subtotal;
      
      orderItems.push({
        ticket: ticket._id,
        event: event._id,
        quantity: item.quantity,
        price: ticket.price,
        subtotal
      });
      
      // Update ticket quantity sold
      ticket.quantitySold += item.quantity;
      await ticket.save();
    }
    
    // Add service fee (e.g., 10%)
    const serviceFee = totalAmount * 0.1;
    totalAmount += serviceFee;
    
    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      paymentInfo: {
        id: paymentIntentId,
        status: 'completed',
        method: 'Credit Card'
      },
      serviceFee,
      totalAmount,
      status: 'completed'
    });
    
    // Clear user's cart if it exists
    await Cart.findOneAndDelete({ user: req.user.id });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items.event',
        select: 'title date venue'
      })
      .populate({
        path: 'items.ticket',
        select: 'type price'
      });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Make sure user owns the order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get payments made by logged in user
// @route   GET /api/payments/user
// @access  Private
exports.getUserPayments = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: 'items.event',
        select: 'title date venue'
      })
      .populate({
        path: 'items.ticket',
        select: 'type price'
      });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get payments for events created by logged in organizer
// @route   GET /api/payments/organizer
// @access  Private (Organizers only)
exports.getOrganizerPayments = async (req, res) => {
  try {
    // Get all events created by the organizer
    const events = await Event.find({ organizer: req.user.id });
    const eventIds = events.map(event => event._id);
    
    // Find orders that contain tickets for these events
    const orders = await Order.find({
      'items.event': { $in: eventIds }
    }).populate({
      path: 'items.event',
      select: 'title date venue'
    }).populate({
      path: 'items.ticket',
      select: 'type price'
    }).populate({
      path: 'user',
      select: 'firstName lastName email'
    });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
