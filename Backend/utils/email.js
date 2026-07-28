const { BrevoClient } = require('@getbrevo/brevo');

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

function buildPurchaseConfirmationEmail(userEmail, purchaseDetails) {
  const { items = [], totalPrice = 0 } = purchaseDetails;

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">$${(
            item.price * item.quantity
          ).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const itemsPlainText = items
    .map(
      (item) =>
        `- ${item.quantity} x ${item.name}: $${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n');

  const htmlContent = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #1b1b1b;">
      <h1 style="color: #d4af37; margin-bottom: 4px;">Purchase Confirmed</h1>
      <p>Thank you for your order! Here is a summary of your Boxing for Justice tickets.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <thead>
          <tr style="text-align: left; border-bottom: 2px solid #d4af37;">
            <th style="padding: 8px 0;">Ticket</th>
            <th style="padding: 8px 0; text-align: center;">Qty</th>
            <th style="padding: 8px 0; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <p style="font-size: 18px; font-weight: bold;">Total Paid: $${totalPrice.toFixed(2)}</p>

      <p>We look forward to seeing you at the event!</p>
      <p style="color: #777; font-size: 12px; margin-top: 32px;">Boxing for Justice</p>
    </div>
  `;

  const textContent = [
    'Purchase Confirmed',
    '',
    'Thank you for your order! Here is a summary of your Boxing for Justice tickets.',
    '',
    itemsPlainText,
    '',
    `Total Paid: $${totalPrice.toFixed(2)}`,
    '',
    'We look forward to seeing you at the event!',
    '',
    'Boxing for Justice',
  ].join('\n');

  return {
    sender: {
      name: process.env.BREVO_SENDER_NAME || 'Boxing for Justice',
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [{ email: userEmail }],
    subject: 'Purchase Confirmation - Boxing for Justice',
    htmlContent,
    textContent,
  };
}

async function sendPurchaseConfirmation(userEmail, purchaseDetails) {
  const email = buildPurchaseConfirmationEmail(userEmail, purchaseDetails);

  try {
    return await brevo.transactionalEmails.sendTransacEmail(email);
  } catch (error) {
    console.error(
      'Brevo purchase confirmation email failed:',
      error?.body || error.message
    );
    throw error;
  }
}

module.exports = { sendPurchaseConfirmation };
