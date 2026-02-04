const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Please specify an activity category'],
    enum: ['transportation', 'energy', 'diet', 'consumption'],
  },
  activityType: {
    type: String,
    required: [true, 'Please specify the activity type'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now,
  },
  // Transportation fields
  transportMode: {
    type: String,
    enum: ['car-petrol', 'car-diesel', 'car-electric', 'bus', 'train', 'flight-short', 'flight-long', 'motorcycle', 'bicycle', ''],
  },
  distance: {
    type: Number,
    min: 0,
  },
  // Energy fields
  energyType: {
    type: String,
    enum: ['electricity', 'natural-gas', 'heating-oil', 'coal', ''],
  },
  consumption: {
    type: Number,
    min: 0,
  },
  unit: {
    type: String,
    enum: ['kwh', 'liters', 'cubic-meters', 'kg', 'units', ''],
  },
  // Diet fields
  mealType: {
    type: String,
    enum: ['beef', 'pork', 'chicken', 'fish', 'vegetarian', 'vegan', ''],
  },
  numberOfMeals: {
    type: Number,
    min: 0,
  },
  // Consumption fields
  itemType: {
    type: String,
  },
  quantity: {
    type: Number,
    min: 0,
  },
  // Calculated emission (in kg CO2)
  carbonEmission: {
    type: Number,
    required: true,
    min: 0,
  },
  // Optional notes
  notes: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Index for faster queries
activitySchema.index({ user: 1, date: -1 });
activitySchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Activity', activitySchema);
