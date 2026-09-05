const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProductCategory',
    autopopulate: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  description: String,
  ref: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Product', schema);
