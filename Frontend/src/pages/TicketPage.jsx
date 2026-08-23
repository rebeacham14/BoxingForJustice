import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { API_URL, getAuthHeaders } from '../utils/api';

export default function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();

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
      <SEO
        title="Boxing Event Tickets | Boxing for Justice"
        description="Purchase tickets for the first Boxing for Justice event and support therapeutic boxing programs that help trauma survivors build confidence, resilience, and community."
      />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            Choose Your <span>Tickets</span>
          </h1>

          <p>Pick standard or table tickets and place your order in seconds.</p>

          <button className="secondary-button" onClick={() => navigate('/mma-events')}>
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
                onChange={(e) => handleQuantityChange(ticket._id, e.target.value)}
              />

              <p className="total">Total: ${ticket.price * getQuantity(ticket._id)}</p>

              <button className="main-button" onClick={() => handleAddToCart(ticket)}>
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
              <div className="cart-item" key={item.ticket?._id ?? item.ticketName}>
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

            <button className="main-button" onClick={() => navigate('/mma-events/checkout')}>
              Proceed to Checkout
            </button>
          </>
        )}
      </section>
    </div>
  );
}
