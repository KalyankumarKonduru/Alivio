const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  getEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent,
  getEventsByOrganizer,
  searchEvents,
  getEventsByCategory
} = require('../controllers/events');
const { protect, authorize } = require('../middleware/auth');

// @route   POST api/events
// @desc    Create a new event
// @access  Private (Organizers only)
router.post('/', protect, authorize('organizer'), (req, res) => {
  const upload = req.app.get('upload');
  console.log('Received POST /api/events request'); // Debug: Log when the route is hit
  upload.single('mainImage')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err.message); // Debug: Log multer errors
      return res.status(400).json({ success: false, message: err.message });
    }
    console.log('Multer processed file:', req.file); // Debug: Log the processed file
    createEvent(req, res);
  });
});

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', getEvents);

// @route   GET api/events/search
// @desc    Search events
// @access  Public
router.get('/search', searchEvents);

// @route   GET api/events/category/:category
// @desc    Get events by category
// @access  Public
router.get('/category/:category', getEventsByCategory);

// @route   GET api/events/organizer
// @desc    Get events created by logged in organizer
// @access  Private (Organizers only)
router.get('/organizer', protect, authorize('organizer'), getEventsByOrganizer);

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', getEventById);

// @route   PUT api/events/:id
// @desc    Update event
// @access  Private (Organizers only)
router.put('/:id', protect, authorize('organizer'), (req, res) => {
  const upload = req.app.get('upload');
  upload.single('mainImage')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    updateEvent(req, res);
  });
});

// @route   DELETE api/events/:id
// @desc    Delete event
// @access  Private (Organizers only)
router.delete('/:id', protect, authorize('organizer'), deleteEvent);

module.exports = router;