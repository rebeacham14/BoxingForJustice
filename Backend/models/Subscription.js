const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // Clerk user id
    provider: { type: String, enum: ['square', 'paypal'], required: true },
    providerSubscriptionId: { type: String, required: true },
    providerCustomerId: { type: String },
    planId: { type: String, required: true },
    // Informational only for display on the Account page - Square's plan
    // variation (not this field) is authoritative for what's actually billed.
    amount: { type: Number },
    status: {
      type: String,
      enum: ['active', 'canceled', 'paused'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
