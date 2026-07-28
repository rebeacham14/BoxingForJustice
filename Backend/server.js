const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const {
  SquareClient,
  SquareEnvironment,
  SquareError,
} = require('square');

require('dotenv').config();

const Order = require('./models/Order');
const Ticket = require('./models/Ticket');
const User = require('./models/User');
const Cart = require('./models/Cart');

const { authMiddleware } = require('./middleware/authMiddleware');
const { sendPurchaseConfirmation } = require('./utils/email');

const app = express();

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
    message: 'JWT authentication is working',
    user: req.user,
  });
});

/* =========================
   AUTH ROUTES
========================= */

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Please fill in all fields',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    return res.status(500).json({
      message: 'Error registering user',
      error: error.message,
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please enter email and password',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Error logging in',
      error: error.message,
    });
  }
});

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
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.ticket'
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
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

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
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
        { user: req.user.id },
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
      { user: req.user.id },
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
    const cart = await Cart.findOne({ user: req.user.id }).populate(
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
            user: req.user.id,
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
      await sendPurchaseConfirmation(req.user.email, {
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
      user: req.user.id,
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
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

