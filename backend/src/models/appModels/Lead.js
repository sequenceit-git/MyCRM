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
  type: {
    type: String,
    default: 'Company',
  },
  name: {
    type: String,
    required: true,
  },
  phone: String,
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  country: String,
  address: String,
  source: {
    type: String,
    default: 'linkedin',
  },
  status: {
    type: String,
    default: 'new',
  },
  notes: String,
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
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

module.exports = mongoose.model('Lead', schema);
