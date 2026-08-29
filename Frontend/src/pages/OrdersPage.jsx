import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import SEO from '../components/common/SEO';
import { API_URL, getAuthHeaders } from '../utils/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch(`${API_URL}/api/orders`, {
          headers: await getAuthHeaders(getToken),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Error loading orders.');
        }

        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      }
    }

    loadOrders();
  }, [getToken]);

  return (
    <div className="page orders-page">
      <SEO
        title="Your Ticket Orders | Boxing for Justice"
        description="Review ticket orders for Boxing for Justice events, including ticket type, quantity, customer information, and order total."
        robots="noindex, nofollow"
      />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            All <span>Orders</span>
          </h1>

          <p>Review your event ticket orders, including ticket type, quantity, and total price.</p>

          <button className="secondary-button" onClick={() => navigate('/mma-events')}>
            Back to Home
          </button>
        </div>

        <div className="page-hero-image">
          <img src="/misc/orders-boxing.jpg" alt="Boxing event ticket orders" />
        </div>
      </section>

      <section className="orders-section">
        {error && <p className="empty-orders">{error}</p>}
        {!error && orders.length === 0 ? (
          <p className="empty-orders">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h2>{order.ticketName}</h2>

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
