import { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = 'https://boxforjuice.onrender.com';

const SQUARE_ENVIRONMENT =
  import.meta.env.VITE_SQUARE_ENVIRONMENT === 'production'
    ? 'production'
    : 'sandbox';

const SQUARE_APPLICATION_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID;
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;

const SQUARE_JS_SRC =
  SQUARE_ENVIRONMENT === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js';

let squareSdkPromise = null;

function loadSquareSdk() {
  if (window.Square) {
    return Promise.resolve(window.Square);
  }

  if (!squareSdkPromise) {
    squareSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SQUARE_JS_SRC;
      script.async = true;
      script.onload = () => resolve(window.Square);
      script.onerror = () => {
        squareSdkPromise = null;
        reject(new Error('Failed to load the Square payment SDK.'));
      };
      document.body.appendChild(script);
    });
  }

  return squareSdkPromise;
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [postLoginRedirect, setPostLoginRedirect] = useState('orders');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (!savedUser || !savedToken) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error('Invalid saved user data:', error);

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('home');
  }

  function goToLogin(redirectTo = 'orders') {
    setPostLoginRedirect(redirectTo);
    setPage('login');
  }

  function handleBuyTicketsClick() {
    if (user) {
      setPage('tickets');
    } else {
      goToLogin('tickets');
    }
  }

  function handleLoginSuccess() {
    setPage(postLoginRedirect);
    setPostLoginRedirect('orders');
  }

  return (
    <div className="app">
      {page === 'home' && (
        <HomePage
          goShop={handleBuyTicketsClick}
          goAbout={() => setPage('about')}
          goOrders={() => setPage('orders')}
          goLogin={() => goToLogin('orders')}
          goRegister={() => setPage('register')}
          user={user}
          handleLogout={handleLogout}
        />
      )}

      {page === 'tickets' && (
        <ProtectedPage goLogin={() => goToLogin('tickets')}>
          <TicketPage
            goHome={() => setPage('home')}
            goLogin={() => goToLogin('tickets')}
            goCheckout={() => setPage('checkout')}
            user={user}
            handleLogout={handleLogout}
          />
        </ProtectedPage>
      )}

      {page === 'checkout' && (
        <ProtectedPage goLogin={() => goToLogin('checkout')}>
          <CheckoutPage
            goHome={() => setPage('home')}
            goLogin={() => goToLogin('checkout')}
            goTickets={() => setPage('tickets')}
            goOrders={() => setPage('orders')}
            user={user}
            handleLogout={handleLogout}
          />
        </ProtectedPage>
      )}

      {page === 'about' && (
        <AboutPage
          goHome={() => setPage('home')}
          goLogin={() => setPage('login')}
          user={user}
          handleLogout={handleLogout}
        />
      )}

      {page === 'orders' && (
        <ProtectedPage goLogin={() => goToLogin('orders')}>
        <OrdersPage
            goHome={() => setPage('home')}
            goLogin={() => goToLogin('orders')}
            user={user}
            handleLogout={handleLogout}
          />
        </ProtectedPage>
      )}

      {page === 'login' && (
        <LoginPage
          goHome={() => setPage('home')}
          goRegister={() => setPage('register')}
          setUser={setUser}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {page === 'register' && (
        <RegisterPage
          goHome={() => setPage('home')}
          goLogin={() => setPage('login')}
        />
      )}
    </div>
  );
}

function HomeSEO() {
  useEffect(() => {
    document.title =
      'Boxing for Justice | Therapeutic Boxing and Community Support';

    const description =
      'Boxing for Justice helps people who have experienced trauma build confidence, strength, and resilience through therapeutic boxing. Purchase tickets for our first community boxing event.';

    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute('content', description);

    let robotsTag = document.querySelector(
      'meta[name="robots"]'
    );

    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }

    robotsTag.setAttribute('content', 'index, follow');
  }, []);

  return null;
}

function TicketSEO() {
  useEffect(() => {
    document.title =
      'Boxing Event Tickets | Boxing for Justice';

    const description =
      'Purchase tickets for the first Boxing for Justice event and support therapeutic boxing programs that help trauma survivors build confidence, resilience, and community.';

    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute('content', description);

    let robotsTag = document.querySelector(
      'meta[name="robots"]'
    );

    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }

    robotsTag.setAttribute('content', 'index, follow');
  }, []);

  return null;
}

function AboutSEO() {
  useEffect(() => {
    document.title =
      'About Boxing for Justice | Therapeutic Boxing for Trauma Support';

    const description =
      'Learn how Boxing for Justice helps people affected by trauma build confidence, resilience, and healthy coping skills through therapeutic boxing and supportive community programs.';

    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute('content', description);

    let robotsTag = document.querySelector(
      'meta[name="robots"]'
    );

    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }

    robotsTag.setAttribute('content', 'index, follow');
  }, []);

  return null;
}

function OrdersSEO() {
  useEffect(() => {
    document.title = 'Your Ticket Orders | Boxing for Justice';

    const description =
      'Review ticket orders for Boxing for Justice events, including ticket type, quantity, customer information, and order total.';

    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute('content', description);

    let robotsTag = document.querySelector('meta[name="robots"]');

    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }

    robotsTag.setAttribute('content', 'noindex, nofollow');
  }, []);

  return null;
}

function Navbar({
  goHome,
  goShop,
  goAbout,
  goOrders,
  goLogin,
  goRegister,
  user,
  handleLogout,
}) {
  return (
    <div className="navbar">
      <h2 className="logo">
        Boxing <span>for Justice</span>
      </h2>

      <div className="nav-links">
        {goHome && <button onClick={goHome}>Home</button>}
        {goShop && <button onClick={goShop}>Buy Tickets</button>}
        {goAbout && <button onClick={goAbout}>About</button>}
        {goOrders && <button onClick={goOrders}>Orders</button>}

        {!user && goLogin && <button onClick={goLogin}>Login</button>}
        {!user && goRegister && <button onClick={goRegister}>Register</button>}

        {user && (
          <>
            <span className="user-name">Hi, {user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}

function ProtectedPage({ children, goLogin }) {
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Please log in to access this page.');
      goLogin();
    }
  }, [token, goLogin]);

  if (!token) {
    return null;
  }

  return children;
}

function HomePage({
  goShop,
  goAbout,
  goOrders,
  goLogin,
  goRegister,
  user,
  handleLogout,
}) {
  return (
    <div className="page home-page">
      <HomeSEO />
      <Navbar
        goShop={goShop}
        goAbout={goAbout}
        goOrders={goOrders}
        goLogin={goLogin}
        goRegister={goRegister}
        user={user}
        handleLogout={handleLogout}
      />

      <section className="hero">
        <div className="hero-text">
          <h1>
            Battle of the Branches - <span>United by Honor</span> 
          </h1>

          <p>
            November 21, 2026 at 4:00 PM. Location: The Derby Room @ Fairplex
          </p>

          <button className="main-button" onClick={goShop}>
            Buy Tickets
          </button>
        </div>

        <div className="hero-image">
          <img src="/home-boxing.jpg" alt="Boxing event" />
        </div>
      </section>
    </div>
  );
}

function TicketPage({ goHome, goLogin, goCheckout, user, handleLogout }) {
  const [tickets, setTickets] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
  fetch(`${API_URL}/api/tickets`)
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Unable to load tickets.');
      }

      return data;
    })
    .then((data) => {
      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        console.error('Tickets response was not an array:', data);
        setTickets([]);
      }
    })
    .catch((error) => {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    });
}, []);

  useEffect(() => {
    fetch(`${API_URL}/api/cart`, {
      headers: getAuthHeaders(),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Unable to load cart.');
        }

        return data;
      })
      .then((data) => setCart(data))
      .catch((error) => {
        console.error('Error fetching cart:', error);
      });
  }, []);

  function getQuantity(ticketId) {
    return quantities[ticketId] ?? 1;
  }

  function handleQuantityChange(ticketId, value) {
    const parsedQuantity = Number(value);

    setQuantities((prev) => ({
      ...prev,
      [ticketId]: Number.isNaN(parsedQuantity) ? 1 : parsedQuantity,
    }));
  }

  function handleAddToCart(ticket) {
    const quantity = getQuantity(ticket._id);

    if (!Number.isInteger(quantity) || quantity < 1) {
      alert('Quantity must be at least 1.');
      return;
    }

    fetch(`${API_URL}/api/cart/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ticketId: ticket._id,
        quantity,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Unable to update cart.');
        }

        return data;
      })
      .then((data) => {
        setCart(data);
        alert(`Added ${quantity} ${ticket.name} to your cart.`);
      })
      .catch((error) => {
        console.error('Error updating cart:', error);
        alert(error.message);
      });
  }

  function handleRemoveFromCart(ticketId) {
    fetch(`${API_URL}/api/cart/items/${ticketId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Unable to update cart.');
        }

        return data;
      })
      .then((data) => setCart(data))
      .catch((error) => {
        console.error('Error removing cart item:', error);
        alert(error.message);
      });
  }

  const cartTotal = cart.items.reduce(
    (sum, item) => sum + (item.ticket?.price ?? 0) * item.quantity,
    0
  );

  return (
    <div className="page shop-page">
      <TicketSEO />
      <Navbar
        goHome={goHome}
        goLogin={goLogin}
        user={user}
        handleLogout={handleLogout}
      />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            Choose Your <span>Tickets</span>
          </h1>

          <p>
            Pick standard or table tickets and place your order in seconds.
          </p>

          <button className="secondary-button" onClick={goHome}>
            Back to Home
          </button>
        </div>

        <div className="page-hero-image">
          <img src="/shop-boxing.jpg" alt="Boxing stadium" />
        </div>
      </section>

      <section className="tickets-section">
        {tickets.length === 0 ? (
          <p className="empty-orders">No tickets are currently available.</p>
        ) : (
          tickets.map((ticket) => (
          <div className="ticket-card" key={ticket._id}>
            <h2>{ticket.name}</h2>
            <p className="price">${ticket.price}</p>
            <p>{ticket.description}</p>

            <input
              type="number"
              min="1"
              className="quantity-input"
              aria-label={`Quantity for ${ticket.name}`}
              value={getQuantity(ticket._id)}
              onChange={(e) =>
                handleQuantityChange(ticket._id, e.target.value)
              }
            />

            <p className="total">
              Total: ${ticket.price * getQuantity(ticket._id)}
            </p>

            <button
              className="main-button"
              onClick={() => handleAddToCart(ticket)}
            >
              Add to Cart
            </button>
          </div>
        ))
      )}
    </section>

    <section className="cart-section">
      <h2>Your Cart</h2>

      {cart.items.length === 0 ? (
        <p className="empty-orders">Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div
              className="cart-item"
              key={item.ticket?._id ?? item.ticketName}
            >
              <span>
                {item.quantity} x {item.ticketName}
              </span>

              <span>${(item.ticket?.price ?? 0) * item.quantity}</span>

              <button
                className="text-button"
                onClick={() => handleRemoveFromCart(item.ticket?._id)}
              >
                Remove
              </button>
            </div>
          ))}

          <p className="total">Cart Total: ${cartTotal}</p>

          <button className="main-button" onClick={goCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </section>
  </div>
  );
}

function CheckoutSEO() {
  useEffect(() => {
    document.title = 'Checkout | Boxing for Justice';

    let robotsTag = document.querySelector('meta[name="robots"]');

    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }

    robotsTag.setAttribute('content', 'noindex, nofollow');
  }, []);

  return null;
}

function CheckoutPage({ goHome, goLogin, goTickets, goOrders, user, handleLogout }) {
  const [cart, setCart] = useState(null);
  const [cartError, setCartError] = useState('');
  const [card, setCard] = useState(null);
  const [sdkStatus, setSdkStatus] = useState('loading');
  const [sdkError, setSdkError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const cardContainerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/api/cart`, {
      headers: getAuthHeaders(),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Unable to load your cart.');
        }

        return data;
      })
      .then((data) => {
        if (!cancelled) {
          setCart(data);
        }
      })
      .catch((error) => {
        console.error('Error fetching cart:', error);

        if (!cancelled) {
          setCartError(error.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!SQUARE_APPLICATION_ID || !SQUARE_LOCATION_ID) {
      setSdkStatus('error');
      setSdkError(
        'Payment form is not configured yet. Please contact support.'
      );
      return;
    }

    let cancelled = false;
    let cardInstance = null;

    loadSquareSdk()
      .then((Square) => Square.payments(SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID))
      .then((payments) => payments.card())
      .then(async (cardMethod) => {
        if (cancelled || !cardContainerRef.current) {
          return;
        }

        await cardMethod.attach(cardContainerRef.current);

        if (cancelled) {
          await cardMethod.destroy();
          return;
        }

        cardInstance = cardMethod;
        setCard(cardMethod);
        setSdkStatus('ready');
      })
      .catch((error) => {
        console.error('Square payment form failed to load:', error);

        if (!cancelled) {
          setSdkStatus('error');
          setSdkError(
            'Unable to load the payment form. Please refresh and try again.'
          );
        }
      });

    return () => {
      cancelled = true;

      if (cardInstance) {
        cardInstance.destroy().catch(() => {});
      }
    };
  }, []);

  const cartItems = cart?.items ?? [];

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.ticket?.price ?? 0) * item.quantity,
    0
  );

  async function handlePay(e) {
    e.preventDefault();

    if (!card || isProcessing) {
      return;
    }

    setPaymentError('');
    setIsProcessing(true);

    try {
      const tokenizeResult = await card.tokenize();

      if (tokenizeResult.status !== 'OK') {
        const detail =
          tokenizeResult.errors?.[0]?.message ||
          'Please check your card details and try again.';

        throw new Error(detail);
      }

      const res = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          token: tokenizeResult.token,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || 'Checkout failed. Please try again.'
        );
      }

      setIsComplete(true);
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="page checkout-page">
      <CheckoutSEO />
      <Navbar
        goHome={goHome}
        goLogin={goLogin}
        user={user}
        handleLogout={handleLogout}
      />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            Secure <span>Checkout</span>
          </h1>

          <p>
            Review your order and enter your payment details to complete
            your purchase.
          </p>

          <button className="secondary-button" onClick={goTickets}>
            Back to Tickets
          </button>
        </div>
      </section>

      {isComplete ? (
        <section className="checkout-section">
          <div className="checkout-success">
            <h2>Payment Successful</h2>

            <p>
              Thank you! Your tickets are confirmed and a receipt has been
              emailed to you.
            </p>

            <button className="main-button" onClick={goOrders}>
              View My Orders
            </button>
          </div>
        </section>
      ) : (
        <section className="checkout-section">
          <div className="checkout-summary">
            <h2>Order Summary</h2>

            {cartError && <p className="checkout-error">{cartError}</p>}

            {cart === null && !cartError ? (
              <p>Loading your cart...</p>
            ) : cartItems.length === 0 ? (
              <>
                <p className="empty-orders">Your cart is empty.</p>

                <button className="secondary-button" onClick={goTickets}>
                  Browse Tickets
                </button>
              </>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    className="cart-item"
                    key={item.ticket?._id ?? item.ticketName}
                  >
                    <span>
                      {item.quantity} x {item.ticketName}
                    </span>

                    <span>
                      ${(item.ticket?.price ?? 0) * item.quantity}
                    </span>
                  </div>
                ))}

                <p className="total">Total Due: ${cartTotal.toFixed(2)}</p>
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <form className="checkout-payment" onSubmit={handlePay}>
              <h2>Payment Details</h2>

              {sdkStatus === 'loading' && (
                <p>Loading secure payment form...</p>
              )}

              {sdkStatus === 'error' && (
                <p className="checkout-error">{sdkError}</p>
              )}

              <div
                ref={cardContainerRef}
                className="square-card-container"
              />

              {paymentError && (
                <p className="checkout-error">{paymentError}</p>
              )}

              <button
                className="main-button"
                type="submit"
                disabled={!card || isProcessing}
              >
                {isProcessing
                  ? 'Processing...'
                  : `Pay $${cartTotal.toFixed(2)}`}
              </button>
            </form>
          )}
        </section>
      )}
    </div>
  );
}

function AboutPage({ goHome, goLogin, user, handleLogout }) {
  return (
    <div className="page about-page">
      <AboutSEO />
      <Navbar
        goHome={goHome}
        goLogin={goLogin}
        user={user}
        handleLogout={handleLogout}
      />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            About <span>Boxing for Justice</span>
          </h1>

          <p>
            {/* Boxing for Justice uses boxing, mentorship, and community support to help
            people build confidence, resilience, discipline, and healthy coping skills.
            Our events bring the community together while supporting programs that
            encourage personal growth and empowerment. */}
            
            Boxing For Justice fosters discipline and resilience. 
            Providing underserved youth with the tools to succeed inside and outside the ring.
          
          </p>

          <button className="secondary-button" onClick={goHome}>
            Back to Home
          </button>
        </div>
      </section>

      <section className="about-cards">


        <div className="about-card">
          <img src="/headshots/Martye.webp" alt="Martye Picture" />
          <h2>Martye</h2>
          <p>
            As the passionate CEO of our promotion company, I turn grit into growth, 
            providing a supportive platform for community Boxers, Muay Thai, and Kickboxers to shine. 
            With a confident, community-first approach, I am dedicated to empowering fighters, 
            ensuring every athlete has the, resources and respect to succeed inside and outside the ring.
            I believe in building champions, not just in sport, but in life. 
            Through relentless support and a vision for inclusive martial arts, 
            I am committed to fostering discipline, resilience, and community spirit. 
            Under my leadership, Boxing For Justice (BFJ) will provide high-quality promotion opportunities, 
            turning dedication into triumph for the next generation of fighters.
          </p>
        </div>

        <div className="about-card">
          <img src="/headshots/about-boxing.png" alt="Lam Picture" />
          <h2>Chris</h2>
          <p>
              {/*  */}
          </p>
        </div>

        <div className="about-card">
          <img src="/headshots/about-boxing.png" alt="Zihong Picture" />
          <h2>Zihong</h2>
          <p>
              {/*  */}
          </p>
        </div>

        <div className="about-card">
          <img src="/headshots/peter.webp" alt="Peter Picture" />
          <h2>Peter</h2>
          <p>
              As Director of Marketing and Recruitment, 
              my goal is to make Boxing for Justice look and operate as a serious, 
              credible organization while staying true to its mission. 
              I focus on clearly communicating what we stand for, 
              why boxing is a tool for discipline and growth, 
              and who the program is really for. I work to attract the right interns, 
              volunteers, coaches, and partners—people who understand structure, 
              accountability, and impact—so the organization can grow without losing its identity. 
              Ultimately, my role is about building trust, consistency, 
              and systems that allow Boxing for Justice to scale sustainably and reach more youth.
          </p>
        </div>

        <div className="about-card">
          <img src="/headshots/ryan.webp" alt="Ryan 'Ace' Picture" />
          <h2>Ryan "Ace"</h2>
          <p>
              I am a senior Software Engineering student with a passion for building robust, 
              user-focused applications. Combining technical expertise with a lifelong love for combat sports, 
              I am eager to leverage software development to empower boxing, Muay Thai, 
              and kickboxing communities. 

              I believe in the transformative power of discipline, 
              resilience, and camaraderie. I am confident in using my 
              skills in web development and data management to streamline 
              operations and elevate the reach of Boxing For Justice.
          </p>
        </div>




        <div className="about-card">
          <h2>Building Confidence</h2>
          <p>Boxing helps participants develop confidence, discipline, and a stronger
            sense of self. </p>
        </div>

        <div className="about-card">
          <h2>Community Support</h2>
          <p>Our programs create a supportive environment where people can grow,
            connect, and feel encouraged.</p>
        </div>

        <div className="about-card">
          <h2>Creating Resilience</h2>
          <p>We teach participants to bounce back from challenges and develop mental toughness.</p>
        </div>
      </section>
    </div>
  );
}

function OrdersPage({ goHome, goLogin, user, handleLogout }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to view orders.');
      goLogin();
      return;
    }

    fetch(`${API_URL}/api/orders`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then(async (res) => {
    const data = await res.json();

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      throw new Error(
        data.message || 'Your login has expired. Please log in again.'
      );
    }

    if (!res.ok) {
      throw new Error(data.message || 'Error loading orders.');
    }

    return data;
  })
  .then((data) => {
    setOrders(data);
  })
  .catch((error) => {
    console.error('Error fetching orders:', error);
    alert(error.message);
    goLogin();
  });
  }, [goLogin]);

  return (
    <div className="page orders-page">
      <OrdersSEO />
      <Navbar
        goHome={goHome}
        goLogin={goLogin}
        user={user}
        handleLogout={handleLogout}
      />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            All <span>Orders</span>
          </h1>

          <p>
            Review your event ticket orders, including ticket type, quantity, and total price.
          </p>

          <button className="secondary-button" onClick={goHome}>
            Back to Home
          </button>
        </div>

        <div className="page-hero-image">
          <img src="/orders-boxing.jpg" alt="Boxing event ticket orders" />
        </div>
      </section>

      <section className="orders-section">
        {orders.length === 0 ? (
          <p className="empty-orders">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h2>{order.ticketName}</h2>

              <p>
                <strong>Name:</strong> {order.buyerName}
              </p>

              <p>
                <strong>Email:</strong> {order.buyerEmail}
              </p>

              <p>
                <strong>Quantity:</strong> {order.quantity}
              </p>

              <p>
                <strong>Total:</strong> ${order.ticketPrice * order.quantity}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

function LoginPage({ goHome, goRegister, setUser, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }

    fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          setUser(data.user);

          alert('Logged in successfully!');
          onLoginSuccess();
        } else {
          alert(data.message || 'Login failed.');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        alert('Something went wrong while logging in.');
      });
  }

  return (
    <div className="page login-page">
      <Navbar goHome={goHome} />

      <section className="auth-box">
        <h1>
          Login to <span>Boxing for Justice</span>
        </h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="main-button" type="submit">
            Login
          </button>
        </form>

        <p>
          Do not have an account?{' '}
          <button className="text-button" onClick={goRegister}>
            Register
          </button>
        </p>
      </section>
    </div>
  );
}

function RegisterPage({ goHome, goLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleRegister(e) {
    e.preventDefault();

    if (!username || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || 'Registered successfully!');

        if (data.message === 'User registered successfully') {
          setUsername('');
          setEmail('');
          setPassword('');
          goLogin();
        }
      })
      .catch((error) => {
        console.error('Register error:', error);
        alert('Something went wrong while registering.');
      });
  }

  return (
    <div className="page register-page">
      <Navbar goHome={goHome} />

      <section className="auth-box">
        <h1>
          Create an <span>Account</span>
        </h1>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="main-button" type="submit">
            Register
          </button>
        </form>

        <p>
          Already have an account?{' '}
          <button className="text-button" onClick={goLogin}>
            Login
          </button>
        </p>
      </section>
    </div>
  );
}

export default App;