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
  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    autopopulate: true,
  },
  clientName: String,
  date: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        autopopulate: true,
      },
      itemName: String,
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
    },
  ],
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
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  notes: String,
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
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

module.exports = mongoose.model('Order', schema);
