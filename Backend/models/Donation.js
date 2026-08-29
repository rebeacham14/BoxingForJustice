const mongoose = require('mongoose');

// Donations are unauthenticated (anyone can donate without an account), so
// name/email are optional and there's no user reference.
const donationSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    amount: { type: Number, required: true },
    provider: { type: String, enum: ['square', 'paypal'], required: true },
    providerPaymentId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
