import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import SEO from '../components/common/SEO';
import { API_URL, getAuthHeaders } from '../utils/api';
import { SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID, loadSquareSdk } from '../utils/square';

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [cartError, setCartError] = useState('');
  const [card, setCard] = useState(null);
  const [sdkStatus, setSdkStatus] = useState('loading');
  const [sdkError, setSdkError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const cardContainerRef = useRef(null);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      try {
        const res = await fetch(`${API_URL}/api/cart`, {
          headers: await getAuthHeaders(getToken),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Unable to load your cart.');
        }

        if (!cancelled) {
          setCart(data);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);

        if (!cancelled) {
          setCartError(error.message);
        }
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [getToken]);

  useEffect(() => {
    if (!SQUARE_APPLICATION_ID || !SQUARE_LOCATION_ID) {
      setSdkStatus('error');
      setSdkError('Payment form is not configured yet. Please contact support.');
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
          setSdkError('Unable to load the payment form. Please refresh and try again.');
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
          tokenizeResult.errors?.[0]?.message || 'Please check your card details and try again.';

        throw new Error(detail);
      }

      const res = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: await getAuthHeaders(getToken),
        body: JSON.stringify({
          token: tokenizeResult.token,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Checkout failed. Please try again.');
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
      <SEO title="Checkout | Boxing for Justice" description="Secure checkout." robots="noindex, nofollow" />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            Secure <span>Checkout</span>
          </h1>

          <p>Review your order and enter your payment details to complete your purchase.</p>

          <button className="secondary-button" onClick={() => navigate('/mma-events/tickets')}>
            Back to Tickets
          </button>
        </div>
      </section>

      {isComplete ? (
        <section className="checkout-section">
          <div className="checkout-success">
            <h2>Payment Successful</h2>

            <p>Thank you! Your tickets are confirmed and a receipt has been emailed to you.</p>

            <button className="main-button" onClick={() => navigate('/mma-events/orders')}>
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

                <button className="secondary-button" onClick={() => navigate('/mma-events/tickets')}>
                  Browse Tickets
                </button>
              </>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.ticket?._id ?? item.ticketName}>
                    <span>
                      {item.quantity} x {item.ticketName}
                    </span>

                    <span>${(item.ticket?.price ?? 0) * item.quantity}</span>
                  </div>
                ))}

                <p className="total">Total Due: ${cartTotal.toFixed(2)}</p>
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <form className="checkout-payment" onSubmit={handlePay}>
              <h2>Payment Details</h2>

              {sdkStatus === 'loading' && <p>Loading secure payment form...</p>}

              {sdkStatus === 'error' && <p className="checkout-error">{sdkError}</p>}

              <div ref={cardContainerRef} className="square-card-container" />

              {paymentError && <p className="checkout-error">{paymentError}</p>}

              <button className="main-button" type="submit" disabled={!card || isProcessing}>
                {isProcessing ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
              </button>
            </form>
          )}
        </section>
      )}
    </div>
  );
}
