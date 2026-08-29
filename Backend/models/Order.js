const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // Clerk user id (e.g. "user_...") - Clerk is the sole identity system
    // now, there is no local User model to reference.
    user: {
      type: String,
      required: true,
    },

    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },

    ticketName: {
      type: String,
      required: true,
    },

    ticketPrice: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    squarePaymentId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['Paid', 'Refunded', 'Failed'],
      default: 'Paid',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);