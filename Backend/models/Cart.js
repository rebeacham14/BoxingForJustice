const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },

    ticketName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const cartSchema = new mongoose.Schema(
  {
    // Clerk user id (e.g. "user_...") - Clerk is the sole identity system
    // now, there is no local User model to reference.
    user: {
      type: String,
      required: true,
      unique: true,
    },

    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cart', cartSchema);
