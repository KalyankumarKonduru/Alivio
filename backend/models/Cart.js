const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      ticket: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ticket',
        required: true
      },
      event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
      },
      price: {
        type: Number,
        required: true
      },
      subtotal: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Cart expires after 24 hours
      const date = new Date();
      date.setHours(date.getHours() + 24);
      return date;
    }
  }
});

// Calculate total amount before saving
CartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  next();
});

module.exports = mongoose.model('Cart', CartSchema);
