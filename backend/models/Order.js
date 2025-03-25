const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
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
  paymentInfo: {
    id: {
      type: String
    },
    status: {
      type: String
    },
    method: {
      type: String,
      default: 'Credit Card'
    },
    lastFour: {
      type: String
    }
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  serviceFee: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  orderNumber: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    // Generate a unique order number (current timestamp + random string)
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `TM-${timestamp}-${randomStr}`;
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
