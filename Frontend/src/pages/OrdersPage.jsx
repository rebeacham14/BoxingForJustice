import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { API_URL } from '../utils/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to view orders.');
      navigate('/mma-events/login', { state: { from: { pathname: '/mma-events/orders' } } });
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

          throw new Error(data.message || 'Your login has expired. Please log in again.');
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
        navigate('/mma-events/login', { state: { from: { pathname: '/mma-events/orders' } } });
      });
  }, [navigate]);

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
