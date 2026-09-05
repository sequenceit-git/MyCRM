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
  code: {
    type: String,
    default: 'USD',
  },
  symbol: {
    type: String,
    required: true,
  },
  decimal_separator: {
    type: String,
    default: '.',
  },
  thousand_separator: {
    type: String,
    default: ',',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
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

module.exports = mongoose.model('Currency', schema);
