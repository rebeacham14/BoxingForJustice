const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const { randomUUID } = require('crypto');
const {
  SquareClient,
  SquareEnvironment,
  SquareError,
} = require('square');
const { createClerkClient } = require('@clerk/backend');

require('dotenv').config();

const Order = require('./models/Order');
const Ticket = require('./models/Ticket');
const Cart = require('./models/Cart');
const Donation = require('./models/Donation');
const Subscription = require('./models/Subscription');

const { authMiddleware } = require('./middleware/authMiddleware');
const contentRoutes = require('./routes/content');
const {
  sendPurchaseConfirmation,
  sendContactNotification,
  sendKickback,
  sendInternshipApplicationNotification,
  sendDonationThankYou,
} = require('./utils/email');

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json());

const squareEnvironment =
  process.env.SQUARE_ENVIRONMENT === 'production'
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox;

const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: squareEnvironment,
});

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function getUserEmail(userId) {
  const user = await clerkClient.users.getUser(userId);
  return user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.get('/', (req, res) => {
  res.send('Backend is working');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

app.get('/api/auth-test', authMiddleware, (req, res) => {
  return res.json({
    message: 'Clerk authentication is working',
    userId: req.auth.userId,
  });
});

/* =========================
   SITE EDITOR (nav / pages / blocks / articles / policies)
   see routes/content.js
========================= */

app.use('/api', contentRoutes);

/* =========================
   TICKET ROUTES
========================= */

app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    return res.json(tickets);
  } catch (error) {
    console.error('Ticket fetch error:', error);

    return res.status(500).json({
      message: 'Error getting tickets',
      error: error.message,
    });
  }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    return res.status(201).json(ticket);
  } catch (error) {
    console.error('Ticket creation error:', error);

    return res.status(400).json({
      message: 'Error creating ticket',
      error: error.message,
    });
  }
});

app.post('/api/seed-tickets', async (req, res) => {
  try {
    await Ticket.deleteMany({});

    const tickets = await Ticket.insertMany([
      {
        name: 'General Admission',
        price: 25,
        description: 'Standard admission to the boxing event.',
        availableSeats: 200,
      },
      {
        name: 'Ringside Seat',
        price: 75,
        description: 'Premium seating close to the boxing ring.',
        availableSeats: 50,
      },
    ]);

    res.json(tickets);
  } catch (error) {
    res.status(500).json({
      message: 'Error seeding tickets',
      error: error.message,
    });
  }
});

/* =========================
   CART ROUTES
========================= */

app.get('/api/cart', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.auth.userId }).populate(
      'items.ticket'
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.auth.userId,
        items: [],
      });
    }

    return res.json(cart);
  } catch (error) {
    console.error('Cart fetch error:', error);

    return res.status(500).json({
      message: 'Error getting cart',
      error: error.message,
    });
  }
});

app.post('/api/cart/items', authMiddleware, async (req, res) => {
  try {
    const { ticketId, quantity } = req.body;
    const parsedQuantity = Number(quantity);

    if (
      !ticketId ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      return res.status(400).json({
        message: 'Missing or invalid ticketId/quantity',
      });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: 'Ticket not found',
      });
    }

    if (ticket.availableSeats < parsedQuantity) {
      return res.status(400).json({
        message: 'Not enough tickets available',
      });
    }

    let cart = await Cart.findOne({ user: req.auth.userId });

    if (!cart) {
      cart = new Cart({
        user: req.auth.userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.ticket.toString() === ticketId
    );

    if (existingItem) {
      existingItem.quantity = parsedQuantity;
    } else {
      cart.items.push({
        ticket: ticket._id,
        ticketName: ticket.name,
        quantity: parsedQuantity,
      });
    }

    await cart.save();
    await cart.populate('items.ticket');

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Cart update error:', error);

    return res.status(500).json({
      message: 'Error updating cart',
      error: error.message,
    });
  }
});

app.delete(
  '/api/cart/items/:ticketId',
  authMiddleware,
  async (req, res) => {
    try {
      const cart = await Cart.findOneAndUpdate(
        { user: req.auth.userId },
        { $pull: { items: { ticket: req.params.ticketId } } },
        { new: true }
      ).populate('items.ticket');

      if (!cart) {
        return res.status(404).json({
          message: 'Cart not found',
        });
      }

      return res.json(cart);
    } catch (error) {
      console.error('Cart item removal error:', error);

      return res.status(500).json({
        message: 'Error removing cart item',
        error: error.message,
      });
    }
  }
);

app.delete('/api/cart', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.auth.userId },
      { $set: { items: [] } },
      { new: true, upsert: true }
    );

    return res.json(cart);
  } catch (error) {
    console.error('Cart clear error:', error);

    return res.status(500).json({
      message: 'Error clearing cart',
      error: error.message,
    });
  }
});

/* =========================
   SQUARE CHECKOUT
========================= */

app.post('/api/checkout', authMiddleware, async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Missing payment token',
    });
  }

  let session;

  try {
    const cart = await Cart.findOne({ user: req.auth.userId }).populate(
      'items.ticket'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty',
      });
    }

    for (const item of cart.items) {
      if (!item.ticket) {
        return res.status(404).json({
          success: false,
          message: `Ticket ${item.ticketName} no longer exists`,
        });
      }

      if (item.ticket.availableSeats < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough tickets available for ${item.ticket.name}`,
        });
      }
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.ticket.price * item.quantity,
      0
    );

    const totalPriceInCents = Math.round(
      totalPrice * 100
    );

    const squareResponse =
      await squareClient.payments.create({
        sourceId: token,
        idempotencyKey: randomUUID(),
        locationId: process.env.SQUARE_LOCATION_ID,
        autocomplete: true,
        amountMoney: {
          amount: BigInt(totalPriceInCents),
          currency: 'USD',
        },
      });

    const payment = squareResponse.payment;

    if (!payment || payment.status !== 'COMPLETED') {
      throw new Error(
        `Square payment was not completed. Status: ${
          payment?.status || 'unknown'
        }`
      );
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const newOrders = [];

    for (const item of cart.items) {
      const updatedTicket = await Ticket.findOneAndUpdate(
        {
          _id: item.ticket._id,
          availableSeats: {
            $gte: item.quantity,
          },
        },
        {
          $inc: {
            availableSeats: -item.quantity,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!updatedTicket) {
        throw new Error(
          `Tickets became unavailable during checkout for ${item.ticketName}`
        );
      }

      const [order] = await Order.create(
        [
          {
            user: req.auth.userId,
            ticket: item.ticket._id,
            ticketName: item.ticket.name,
            ticketPrice: item.ticket.price,
            quantity: item.quantity,
            totalPrice: item.ticket.price * item.quantity,
            squarePaymentId: payment.id,
            status: 'Paid',
          },
        ],
        {
          session,
        }
      );

      newOrders.push(order);
    }

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();

    try {
      const email = await getUserEmail(req.auth.userId);
      await sendPurchaseConfirmation(email, {
        items: newOrders.map((order) => ({
          name: order.ticketName,
          quantity: order.quantity,
          price: order.ticketPrice,
        })),
        totalPrice,
      });
    } catch (emailError) {
      console.error(
        'Purchase confirmation email failed to send:',
        emailError.message
      );
    }

    return res.status(201).json({
      success: true,
      message:
        'Payment completed and orders placed successfully',
      orders: newOrders,
    });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }

    console.error('Checkout error:', error);

    let errorMessage = error.message;

    if (
      error instanceof SquareError &&
      Array.isArray(error.errors) &&
      error.errors.length > 0
    ) {
      errorMessage =
        error.errors[0].detail ||
        error.errors[0].code ||
        error.message;
    }

    return res.status(500).json({
      success: false,
      message: 'Checkout processing failed',
      error: errorMessage,
    });
  } finally {
    session?.endSession();
  }
});

/* =========================
   ORDER ROUTES
========================= */

app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.auth.userId,
    })
      .populate('ticket')
      .sort({
        createdAt: -1,
      });

    return res.json(orders);
  } catch (error) {
    console.error('Order fetch error:', error);

    return res.status(500).json({
      message: 'Error getting orders',
      error: error.message,
    });
  }
});

/* =========================
   CONTACT ROUTES
   (Request a training, Discuss partnership, bottom-of-page contact form -
   see Frontend/src/components/site/ContactForm.jsx)
========================= */

app.post('/api/contact', async (req, res) => {
  try {
    const { type, name, email, org, phone, comment } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    await sendContactNotification({ type, name, email, org, phone, comment });

    try {
      await sendKickback(email, '- an associate from bfj will get back to you');
    } catch (emailError) {
      console.error('Contact kickback email failed to send:', emailError.message);
    }

    return res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    console.error('Contact submission error:', error);

    return res.status(500).json({
      message: 'Error sending message',
      error: error.message,
    });
  }
});

/* =========================
   INTERNSHIP APPLICATION
========================= */

app.post(
  '/api/internship-apply',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { position, name, email, phone } = req.body;

      if (!position || !name || !email) {
        return res.status(400).json({
          message: 'position, name, and email are required',
        });
      }

      const files = [
        ...(req.files?.resume || []),
        ...(req.files?.coverLetter || []),
      ];

      await sendInternshipApplicationNotification(
        { position, name, email, phone },
        files
      );

      try {
        await sendKickback(
          email,
          `Thank you for your interest in ${position}. BFJ will get back to you as soon as we can.`
        );
      } catch (emailError) {
        console.error('Internship kickback email failed to send:', emailError.message);
      }

      return res.status(201).json({ message: 'Application submitted' });
    } catch (error) {
      console.error('Internship application error:', error);

      return res.status(500).json({
        message: 'Error submitting application',
        error: error.message,
      });
    }
  }
);

/* =========================
   DONATE (unauthenticated - anyone can donate)
========================= */

app.post('/api/donate', async (req, res) => {
  const { provider, token, amount, name, email } = req.body;

  if (provider === 'paypal') {
    return res.status(501).json({ message: 'PayPal donations are not configured yet.' });
  }

  const parsedAmount = Number(amount);

  if (!token || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Missing or invalid token/amount' });
  }

  try {
    const squareResponse = await squareClient.payments.create({
      sourceId: token,
      idempotencyKey: randomUUID(),
      locationId: process.env.SQUARE_LOCATION_ID,
      autocomplete: true,
      amountMoney: {
        amount: BigInt(Math.round(parsedAmount * 100)),
        currency: 'USD',
      },
    });

    const payment = squareResponse.payment;

    if (!payment || payment.status !== 'COMPLETED') {
      throw new Error(`Square payment was not completed. Status: ${payment?.status || 'unknown'}`);
    }

    const donation = await Donation.create({
      name,
      email,
      amount: parsedAmount,
      provider: 'square',
      providerPaymentId: payment.id,
    });

    if (email) {
      try {
        await sendDonationThankYou(email, parsedAmount);
      } catch (emailError) {
        console.error('Donation thank-you email failed to send:', emailError.message);
      }
    }

    return res.status(201).json({ success: true, donation });
  } catch (error) {
    console.error('Donation error:', error);

    let errorMessage = error.message;

    if (error instanceof SquareError && Array.isArray(error.errors) && error.errors.length > 0) {
      errorMessage = error.errors[0].detail || error.errors[0].code || error.message;
    }

    return res.status(500).json({ success: false, message: 'Donation processing failed', error: errorMessage });
  }
});

/* =========================
   ENROLL (mma-events side site, Clerk-authenticated)
========================= */

app.post('/api/enroll', authMiddleware, async (req, res) => {
  try {
    const { name, age, email } = req.body;

    if (!name || !age || !email) {
      return res.status(400).json({ message: 'name, age, and email are required' });
    }

    const record = {
      userId: req.auth.userId,
      name,
      age,
      email,
      submittedAt: new Date().toISOString(),
    };

    // Flat-file storage for now, per the current phase of the project -
    // will move to a cloud-backed, secure endpoint later.
    await fs.appendFile(
      path.join(__dirname, 'BoxingEnrollments.txt'),
      `${JSON.stringify(record)}\n`
    );

    return res.status(201).json({ message: 'Enrolled' });
  } catch (error) {
    console.error('Enrollment error:', error);

    return res.status(500).json({
      message: 'Error submitting enrollment',
      error: error.message,
    });
  }
});

/* =========================
   SUBSCRIPTIONS (Account page monthly giving)
========================= */

app.get('/api/subscriptions', authMiddleware, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.auth.userId }).sort({ createdAt: -1 });
    return res.json(subscriptions);
  } catch (error) {
    console.error('Subscription fetch error:', error);

    return res.status(500).json({
      message: 'Error getting subscriptions',
      error: error.message,
    });
  }
});

app.post('/api/subscriptions', authMiddleware, async (req, res) => {
  const { provider, token } = req.body;

  if (provider === 'paypal') {
    return res.status(501).json({ message: 'PayPal subscriptions are not configured yet.' });
  }

  if (!token) {
    return res.status(400).json({ message: 'Missing payment token' });
  }

  if (!process.env.SQUARE_SUBSCRIPTION_PLAN_VARIATION_ID) {
    return res.status(503).json({ message: 'Monthly giving is not configured yet.' });
  }

  try {
    const email = await getUserEmail(req.auth.userId);

    const customerResponse = await squareClient.customers.create({
      idempotencyKey: randomUUID(),
      emailAddress: email,
      referenceId: req.auth.userId,
    });
    const customerId = customerResponse.customer.id;

    const cardResponse = await squareClient.cards.create({
      idempotencyKey: randomUUID(),
      sourceId: token,
      card: { customerId },
    });
    const cardId = cardResponse.card.id;

    const subscriptionResponse = await squareClient.subscriptions.create({
      idempotencyKey: randomUUID(),
      locationId: process.env.SQUARE_LOCATION_ID,
      planVariationId: process.env.SQUARE_SUBSCRIPTION_PLAN_VARIATION_ID,
      customerId,
      cardId,
    });

    const subscription = await Subscription.create({
      user: req.auth.userId,
      provider: 'square',
      providerSubscriptionId: subscriptionResponse.subscription.id,
      providerCustomerId: customerId,
      planId: process.env.SQUARE_SUBSCRIPTION_PLAN_VARIATION_ID,
      status: 'active',
    });

    return res.status(201).json(subscription);
  } catch (error) {
    console.error('Subscription creation error:', error);

    let errorMessage = error.message;

    if (error instanceof SquareError && Array.isArray(error.errors) && error.errors.length > 0) {
      errorMessage = error.errors[0].detail || error.errors[0].code || error.message;
    }

    return res.status(500).json({ message: 'Could not start monthly giving', error: errorMessage });
  }
});

app.post('/api/subscriptions/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.auth.userId,
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    if (subscription.provider === 'square') {
      await squareClient.subscriptions.cancel({
        subscriptionId: subscription.providerSubscriptionId,
      });
    }

    subscription.status = 'canceled';
    await subscription.save();

    return res.json(subscription);
  } catch (error) {
    console.error('Subscription cancellation error:', error);

    return res.status(500).json({
      message: 'Error cancelling subscription',
      error: error.message,
    });
  }
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
