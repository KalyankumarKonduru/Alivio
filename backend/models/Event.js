const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Music',
      'Sports',
      'Arts & Theater',
      'Family',
      'Comedy',
      'Festivals',
      'Film',
      'Miscellaneous'
    ]
  },
  subCategory: {
    type: String
  },
  venue: {
    name: {
      type: String,
      required: [true, 'Please add a venue name']
    },
    address: {
      street: String,
      city: {
        type: String,
        required: [true, 'Please add a city']
      },
      state: String,
      zipCode: String,
      country: {
        type: String,
        required: [true, 'Please add a country']
      }
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    }
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  endDate: {
    type: Date
  },
  time: {
    type: String,
    required: [true, 'Please add an event time']
  },
  duration: {
    type: Number // in minutes
  },
  images: [String],
  mainImage: {
    type: String,
    default: 'default-event.jpg'
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  tags: [String],
  ageRestriction: {
    type: String,
    enum: ['All Ages', '18+', '21+'],
    default: 'All Ages'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for event's tickets
EventSchema.virtual('tickets', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: 'event',
  justOne: false
});

// Cascade delete tickets when an event is deleted
EventSchema.pre('remove', async function(next) {
  await this.model('Ticket').deleteMany({ event: this._id });
  next();
});

module.exports = mongoose.model('Event', EventSchema);
