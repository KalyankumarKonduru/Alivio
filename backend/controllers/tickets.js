const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private (Organizers only)
exports.createTicket = async (req, res) => {
  try {
    // Check if event exists
    const event = await Event.findById(req.body.event);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Make sure user is event organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to create tickets for this event'
      });
    }
    
    const ticket = await Ticket.create(req.body);
    
    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private (Admin only)
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate({
      path: 'event',
      select: 'title date venue',
      populate: {
        path: 'organizer',
        select: 'firstName lastName'
      }
    });
    
    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate({
      path: 'event',
      select: 'title date venue',
      populate: {
        path: 'organizer',
        select: 'firstName lastName'
      }
    });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private (Organizers only)
exports.updateTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    // Check if event exists and user is organizer
    const event = await Event.findById(ticket.event);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Make sure user is event organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update tickets for this event'
      });
    }
    
    ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Organizers only)
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    // Check if event exists and user is organizer
    const event = await Event.findById(ticket.event);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Make sure user is event organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete tickets for this event'
      });
    }
    
    await ticket.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get tickets by event
// @route   GET /api/tickets/event/:eventId
// @access  Public
exports.getTicketsByEvent = async (req, res) => {
  try {
    console.log('Getting tickets for event ID:', req.params.eventId);
    
    // Make sure to include virtuals in the response
    const tickets = await Ticket.find({ event: req.params.eventId, active: true });
    console.log('Found', tickets.length, 'tickets for this event');
    
    if (tickets.length === 0) {
      // If no tickets found, try to check if the event exists
      const Event = require('../models/Event');
      const event = await Event.findById(req.params.eventId);
      console.log('Event exists:', !!event);
      
      // Return early if no tickets
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        debug: {
          eventExists: !!event,
          requestedEventId: req.params.eventId
        }
      });
    }
    
    // Convert Mongoose documents to JSON to include virtuals
    const ticketsWithVirtuals = tickets.map(ticket => {
      const ticketObj = ticket.toObject({ virtuals: true });
      // Add soldOut property explicitly if it's not already included
      ticketObj.soldOut = ticket.quantitySold >= ticket.quantity;
      ticketObj.available = ticket.quantity - ticket.quantitySold;
      return ticketObj;
    });
    
    console.log('Returning tickets with virtuals:', ticketsWithVirtuals.length);
    
    res.status(200).json({
      success: true,
      count: tickets.length,
      data: ticketsWithVirtuals,
      debug: {
        requestedEventId: req.params.eventId
      }
    });
  } catch (err) {
    console.error('Error getting tickets:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
      debug: {
        requestedEventId: req.params.eventId
      }
    });
  }
};

// @desc    Get tickets purchased by logged in user
// @route   GET /api/tickets/user
// @access  Private
exports.getTicketsByUser = async (req, res) => {
  try {
    // This would typically query the Order model to find tickets purchased by the user
    // For now, we'll return a placeholder response
    res.status(200).json({
      success: true,
      message: 'This endpoint will return tickets purchased by the user',
      data: []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
