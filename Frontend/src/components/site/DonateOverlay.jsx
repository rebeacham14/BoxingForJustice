import { useEffect, useRef, useState } from 'react';
import Overlay from '../common/Overlay';
import { loadSquareSdk, SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID } from '../../utils/square';
import { submitDonation } from '../../utils/contactApi';

export default function DonateOverlay({ onClose }) {
  const [provider, setProvider] = useState('square');
  const [amount, setAmount] = useState('');
  const [sdkStatus, setSdkStatus] = useState('loading');
  const [sdkError, setSdkError] = useState('');
  const [card, setCard] = useState(null);
  const [status, setStatus] = useState('idle');
  const cardContainerRef = useRef(null);

  useEffect(() => {
    if (provider !== 'square') return undefined;

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
  }, [provider]);

  async function handleSquareSubmit(e) {
    e.preventDefault();
    if (!card) return;
    setStatus('submitting');
    try {
      const result = await card.tokenize();
      if (result.status !== 'OK') {
        throw new Error(result.errors?.[0]?.message || 'Card was declined.');
      }
      await submitDonation({ provider: 'square', token: result.token, amount: Number(amount) });
      setStatus('success');
    } catch (error) {
      setSdkError(error.message || 'Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <Overlay title="Thank you" onClose={onClose}>
        <p className="form-status form-status-success">
          Thank you for your donation — it makes this work possible.
        </p>
      </Overlay>
    );
  }

  return (
    <Overlay title="Donate securely" onClose={onClose}>
      <div className="donate-provider-toggle">
        <button
          type="button"
          className={provider === 'square' ? 'active' : ''}
          onClick={() => setProvider('square')}
        >
          Card (Square)
        </button>
        <button
          type="button"
          className={provider === 'paypal' ? 'active' : ''}
          onClick={() => setProvider('paypal')}
        >
          PayPal
        </button>
      </div>

      {provider === 'paypal' ? (
        <p className="content-placeholder">
          PayPal donations aren&apos;t configured yet — check back soon, or use a card above.
        </p>
      ) : (
        <form onSubmit={handleSquareSubmit}>
          <label className="form-field">
            <span>Amount (USD)</span>
            <input
              type="number"
              min="1"
              step="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Card details</span>
            <div ref={cardContainerRef} />
          </label>
          {sdkStatus === 'error' && <p className="form-status form-status-error">{sdkError}</p>}
          <button
            type="submit"
            className="form-submit"
            disabled={sdkStatus !== 'ready' || status === 'submitting' || !amount}
          >
            {status === 'submitting' ? 'Processing…' : 'Donate'}
          </button>
        </form>
      )}
    </Overlay>
  );
}
