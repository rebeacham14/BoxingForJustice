import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import SEO from '../components/common/SEO';
import { API_URL, getAuthHeaders } from '../utils/api';
import { SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID, loadSquareSdk } from '../utils/square';

export default function AccountPage() {
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [card, setCard] = useState(null);
  const [sdkStatus, setSdkStatus] = useState('loading');
  const [sdkError, setSdkError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const cardContainerRef = useRef(null);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const activeSubscription = subscriptions.find((s) => s.status === 'active');

  async function loadAccountData() {
    try {
      const headers = await getAuthHeaders(getToken);
      const [ordersRes, subsRes] = await Promise.all([
        fetch(`${API_URL}/api/orders`, { headers }),
        fetch(`${API_URL}/api/subscriptions`, { headers }),
      ]);
      const [ordersData, subsData] = await Promise.all([ordersRes.json(), subsRes.json()]);

      if (!ordersRes.ok) throw new Error(ordersData.message || 'Unable to load orders.');
      if (!subsRes.ok) throw new Error(subsData.message || 'Unable to load subscriptions.');

      setOrders(ordersData);
      setSubscriptions(subsData);
    } catch (error) {
      console.error('Error loading account data:', error);
      setLoadError(error.message);
    }
  }

  useEffect(() => {
    loadAccountData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  useEffect(() => {
    if (activeSubscription) return undefined;

    if (!SQUARE_APPLICATION_ID || !SQUARE_LOCATION_ID) {
      setSdkStatus('error');
      setSdkError('Payment form is not configured yet. Please contact support.');
      return undefined;
    }

    let cancelled = false;
    let cardInstance = null;

    loadSquareSdk()
      .then((Square) => Square.payments(SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID))
      .then((payments) => payments.card())
      .then(async (cardMethod) => {
        if (cancelled || !cardContainerRef.current) return;
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
        if (cancelled) return;
        setSdkStatus('error');
        setSdkError(error.message || 'Could not load the payment form.');
      });

    return () => {
      cancelled = true;
      if (cardInstance) cardInstance.destroy().catch(() => {});
    };
  }, [activeSubscription]);

  async function handleStartGiving(e) {
    e.preventDefault();
    if (!card) return;
    setIsProcessing(true);
    setSdkError('');

    try {
      const result = await card.tokenize();
      if (result.status !== 'OK') {
        throw new Error(result.errors?.[0]?.message || 'Card was declined.');
      }

      const res = await fetch(`${API_URL}/api/subscriptions`, {
        method: 'POST',
        headers: await getAuthHeaders(getToken),
        body: JSON.stringify({ provider: 'square', token: result.token }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Could not start monthly giving.');
      }

      await loadAccountData();
    } catch (error) {
      setSdkError(error.message);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleCancel() {
    if (!activeSubscription) return;
    setIsProcessing(true);

    try {
      const res = await fetch(`${API_URL}/api/subscriptions/${activeSubscription._id}/cancel`, {
        method: 'POST',
        headers: await getAuthHeaders(getToken),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Could not cancel monthly giving.');
      }

      await loadAccountData();
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="page account-page">
      <SEO title="My Account | Boxing for Justice" description="Manage your orders and monthly giving." robots="noindex, nofollow" />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            My <span>Account</span>
          </h1>
          <p>Review your orders and manage monthly giving.</p>
          <button className="secondary-button" onClick={() => navigate('/mma-events')}>
            Back to Home
          </button>
        </div>
      </section>

      {loadError && <p className="checkout-error">{loadError}</p>}

      <section className="checkout-section">
        <div className="checkout-summary">
          <h2>Monthly Giving</h2>

          {activeSubscription ? (
            <>
              <p>Status: {activeSubscription.status}</p>
              <button className="main-button" onClick={handleCancel} disabled={isProcessing}>
                {isProcessing ? 'Cancelling…' : 'Cancel monthly giving'}
              </button>
            </>
          ) : (
            <form onSubmit={handleStartGiving}>
              {sdkStatus === 'loading' && <p>Loading secure payment form...</p>}
              {sdkStatus === 'error' && <p className="checkout-error">{sdkError}</p>}
              <div ref={cardContainerRef} className="square-card-container" />
              {sdkStatus === 'ready' && sdkError && <p className="checkout-error">{sdkError}</p>}
              <button className="main-button" type="submit" disabled={!card || isProcessing}>
                {isProcessing ? 'Processing…' : 'Start monthly giving'}
              </button>
            </form>
          )}
        </div>

        <div className="checkout-summary">
          <h2>Order History</h2>
          {orders.length === 0 ? (
            <p className="empty-orders">No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div className="cart-item" key={order._id}>
                <span>{order.quantity} x {order.ticketName}</span>
                <span>${order.ticketPrice * order.quantity}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
