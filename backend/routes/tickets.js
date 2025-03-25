const express = require('express');
const router = express.Router();
const { 
  createTicket, 
  getTickets, 
  getTicketById, 
  updateTicket, 
  deleteTicket,
  getTicketsByEvent,
  getTicketsByUser
} = require('../controllers/tickets');
const { protect, authorize } = require('../middleware/auth');

// @route   POST api/tickets
// @desc    Create a new ticket
// @access  Private (Organizers only)
router.post('/', protect, authorize('organizer'), createTicket);

// @route   GET api/tickets
// @desc    Get all tickets
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), getTickets);

// @route   GET api/tickets/event/:eventId
// @desc    Get tickets by event
// @access  Public
router.get('/event/:eventId', getTicketsByEvent);

// @route   GET api/tickets/user
// @desc    Get tickets purchased by logged in user
// @access  Private
router.get('/user', protect, getTicketsByUser);

// @route   GET api/tickets/:id
// @desc    Get ticket by ID
// @access  Private
router.get('/:id', protect, getTicketById);

// @route   PUT api/tickets/:id
// @desc    Update ticket
// @access  Private (Organizers only)
router.put('/:id', protect, authorize('organizer'), updateTicket);

// @route   DELETE api/tickets/:id
// @desc    Delete ticket
// @access  Private (Organizers only)
router.delete('/:id', protect, authorize('organizer'), deleteTicket);

module.exports = router;
