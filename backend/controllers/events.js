const Event = require('../models/Event');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const fs = require('fs').promises; // For file system operations (to delete old images)
const path = require('path');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizers only)
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subCategory,
      date,
      time,
      venue,
      ageRestriction,
      status,
      endDate,
      duration,
      tags,
      featured,
    } = req.body;

    // Validate required fields (optional, since Mongoose will handle this, but good for early feedback)
    if (!title || !description || !category || !venue?.name || !venue?.address?.city || !venue?.address?.country || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, venue name, city, country, date, and time',
      });
    }

    // Construct the event object
    const eventData = {
      title,
      description,
      category,
      subCategory: subCategory || undefined, // Optional
      date: new Date(date),
      time,
      venue: {
        name: venue.name,
        address: {
          street: venue.address.street || undefined,
          city: venue.address.city,
          state: venue.address.state || undefined,
          zipCode: venue.address.zipCode || undefined,
          country: venue.address.country,
        },
        location: venue.location?.type
          ? {
              type: venue.location.type,
              coordinates: [
                parseFloat(venue.location.coordinates[0]), // lng
                parseFloat(venue.location.coordinates[1]), // lat
              ],
            }
          : undefined, // Optional
      },
      mainImage: req.file ? `/uploads/${req.file.filename}` : undefined, // Override default if file is uploaded
      ageRestriction: ageRestriction || undefined, // Will use default if not provided
      status: status || undefined, // Will use default if not provided
      organizer: req.user.id, // Add the organizer from req.user
      endDate: endDate ? new Date(endDate) : undefined, // Optional
      duration: duration ? parseInt(duration) : undefined, // Optional
      tags: tags ? tags.split(',').map((tag) => tag.trim()) : undefined, // Optional, convert comma-separated string to array
      featured: featured === 'true' || featured === true, // Optional, convert to boolean
    };

    console.log('Creating event with data:', eventData); // Debug

    // Create the event
    const event = await Event.create(eventData);

    // Debug log all request body keys
    console.log('Request body keys:', Object.keys(req.body));
    
    // Parse ticket data from form data
    const ticketData = [];
    let ticketIndex = 0;
    let hasTickets = false;
    
    // Check if we have ticket data in the form
    while (req.body[`tickets[${ticketIndex}][type]`] || req.body[`tickets[${ticketIndex}].type`]) {
      hasTickets = true;
      // Try both formats since form data can be parsed differently
      const ticketPrefix = req.body[`tickets[${ticketIndex}][type]`] ? `tickets[${ticketIndex}]` : `tickets[${ticketIndex}].`;
      
      // Extract ticket data based on the detected prefix format
      const ticket = {
        type: req.body[`${ticketPrefix}[type]`] || req.body[`${ticketPrefix}type`],
        price: req.body[`${ticketPrefix}[price]`] || req.body[`${ticketPrefix}price`],
        quantity: req.body[`${ticketPrefix}[quantity]`] || req.body[`${ticketPrefix}quantity`],
        description: req.body[`${ticketPrefix}[description]`] || req.body[`${ticketPrefix}description`] || '',
        maxPerPurchase: req.body[`${ticketPrefix}[maxPerPurchase]`] || req.body[`${ticketPrefix}maxPerPurchase`] || 10
      };
      
      ticketData.push(ticket);
      ticketIndex++;
    }
    
    // If no tickets found using the bracket notation, try looking for a JSON string
    if (!hasTickets && req.body.tickets && typeof req.body.tickets === 'string') {
      try {
        const parsed = JSON.parse(req.body.tickets);
        if (Array.isArray(parsed)) {
          ticketData.push(...parsed);
          hasTickets = true;
        }
      } catch (error) {
        console.error('Error parsing tickets JSON:', error);
      }
    }
    
    // If tickets found, create them
    if (hasTickets && ticketData.length > 0) {
      console.log('Creating tickets for event:', ticketData);
      
      // Create tickets for the event
      const ticketPromises = ticketData.map(ticket => {
        return Ticket.create({
          event: event._id,
          type: ticket.type,
          price: parseFloat(ticket.price),
          quantity: parseInt(ticket.quantity),
          description: ticket.description || '',
          maxPerPurchase: parseInt(ticket.maxPerPurchase) || 10
        });
      });
      
      // Wait for all tickets to be created
      await Promise.all(ticketPromises);
    } else {
      console.log('No ticket data found in request');
    }

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    // Finding resource
    let query = Event.find(JSON.parse(queryStr)).populate('organizer', 'firstName lastName');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Event.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const events = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: events.length,
      pagination,
      data: events,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'firstName lastName');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizers only)
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Make sure user is event organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    // Construct the updated data
    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      subCategory: req.body.subCategory || undefined,
      date: req.body.date ? new Date(req.body.date) : undefined,
      time: req.body.time,
      venue: {
        name: req.body.venue.name,
        address: {
          street: req.body.venue.address.street || undefined,
          city: req.body.venue.address.city,
          state: req.body.venue.address.state || undefined,
          zipCode: req.body.venue.address.zipCode || undefined,
          country: req.body.venue.address.country,
        },
        location: req.body.venue.location?.type
          ? {
              type: req.body.venue.location.type,
              coordinates: [
                parseFloat(req.body.venue.location.coordinates[0]), // lng
                parseFloat(req.body.venue.location.coordinates[1]), // lat
              ],
            }
          : undefined,
      },
      ageRestriction: req.body.ageRestriction || undefined,
      status: req.body.status || undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      duration: req.body.duration ? parseInt(req.body.duration) : undefined,
      tags: req.body.tags ? req.body.tags.split(',').map((tag) => tag.trim()) : undefined,
      featured: req.body.featured === 'true' || req.body.featured === true,
    };

    // If a new file is uploaded, update mainImage and delete the old image
    if (req.file) {
      // Delete the old image if it exists and is not the default
      if (event.mainImage && event.mainImage !== 'default-event.jpg') {
        const oldImagePath = path.join(__dirname, '..', '..', event.mainImage);
        try {
          await fs.unlink(oldImagePath);
          console.log(`Deleted old image: ${oldImagePath}`);
        } catch (err) {
          console.error(`Error deleting old image: ${err.message}`);
        }
      }
      // Set the new image path
      updatedData.mainImage = `/uploads/${req.file.filename}`;
    }

    event = await Event.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizers only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Make sure user is event organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    // Delete the image file if it exists and is not the default
    if (event.mainImage && event.mainImage !== 'default-event.jpg') {
      const imagePath = path.join(__dirname, '..', '..', event.mainImage);
      try {
        await fs.unlink(imagePath);
        console.log(`Deleted image: ${imagePath}`);
      } catch (err) {
        console.error(`Error deleting image: ${err.message}`);
      }
    }

    await event.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get events created by logged in organizer
// @route   GET /api/events/organizer
// @access  Private (Organizers only)
exports.getEventsByOrganizer = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
// In your backend controller
exports.searchEvents = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search keyword',
      });
    }

<<<<<<< HEAD
    const events = await Event.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { 'venue.name': { $regex: keyword, $options: 'i' } },
        { 'venue.address.city': { $regex: keyword, $options: 'i' } },
        { 'venue.address.country': { $regex: keyword, $options: 'i' } },
=======
    // Create case-insensitive search regex
    const searchRegex = new RegExp(keyword, 'i');
    
    const events = await Event.find({
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { 'venue.name': { $regex: searchRegex } },
        { 'venue.address.city': { $regex: searchRegex } },
        { 'venue.address.country': { $regex: searchRegex } },
>>>>>>> 75a19f2 (changes done to search and home page)
      ],
    }).populate('organizer', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get events by category
// @route   GET /api/events/category/:category
// @access  Public
// In your backend controller (events.js)
exports.getEventsByCategory = async (req, res) => {
  try {
<<<<<<< HEAD
    const events = await Event.find({ category: req.params.category }).populate(
      'organizer',
      'firstName lastName'
    );
=======
    const events = await Event.find({ 
      category: req.params.category 
    }).populate('organizer', 'firstName lastName');
>>>>>>> 75a19f2 (changes done to search and home page)

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};