// src/models/Wine.js

import mongoose from 'mongoose';

const WineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a wine name'],
    trim: true
  },
  slug: {
    type: String,
    default: function() {
      return this.name && this.vintage 
        ? `${this.name}-${this.vintage}`
            .toLowerCase()
            .replace(/[\s&\/\\#,+()$~%.'":*?<>{}]/g, '-')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '')
        : null;
    }
  },
  producer: {
    type: String,
    required: [true, 'Please provide a producer name'],
    trim: true
  },
  vintage: {
    type: Number,
    required: [true, 'Please provide a vintage year']
  },
  type: {
    type: String,
    required: true,
    enum: ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified']
  },
  region: {
    country: {
      type: String,
      required: true
    },
    area: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  varietal: [{
    type: String,
    trim: true
  }],
  details: {
    alcoholContent: Number,
    price: Number,
    purchaseDate: Date,
    purchaseLocation: String,
    quantity: {
      type: Number,
      default: 1
    },
    cellarLocation: String
  },
  tasting: {
    date: Date,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    notes: String,
    aromas: [String],
    pairings: [String]
  },
  image: {
    url: String,
    alt: String
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Delete existing model if it exists
mongoose.models = {};

const Wine = mongoose.models.Wine || mongoose.model('Wine', WineSchema);

export default Wine;