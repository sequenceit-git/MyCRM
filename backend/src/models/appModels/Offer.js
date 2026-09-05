const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  lead: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lead',
    autopopulate: true,
  },
  leadName: String,
  date: {
    type: Date,
    required: true,
  },
  expiredDate: {
    type: Date,
    required: true,
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      description: String,
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  taxRate: {
    type: Number,
    default: 0,
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  taxTotal: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  notes: String,
  status: {
    type: String,
    enum: ['draft', 'pending', 'sent', 'accepted', 'declined', 'expired'],
    default: 'draft',
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

offerSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Offer', offerSchema);
