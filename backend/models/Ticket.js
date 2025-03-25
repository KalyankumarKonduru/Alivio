const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Please add a ticket type'],
    enum: ['General', 'VIP', 'Premium', 'Early Bird', 'Group', 'Student']
  },
  price: {
    type: Number,
    required: [true, 'Please add a ticket price']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add ticket quantity']
  },
  quantitySold: {
    type: Number,
    default: 0
  },
  description: {
    type: String
  },
  saleStartDate: {
    type: Date,
    default: Date.now
  },
  saleEndDate: {
    type: Date
  },
  maxPerPurchase: {
    type: Number,
    default: 10
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for available tickets
TicketSchema.virtual('available').get(function() {
  return this.quantity - this.quantitySold;
});

// Virtual for sold out status
TicketSchema.virtual('soldOut').get(function() {
  return this.quantitySold >= this.quantity;
});

module.exports = mongoose.model('Ticket', TicketSchema);
