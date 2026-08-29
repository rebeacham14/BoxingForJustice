const mailchimpTxFactory = require('@mailchimp/mailchimp_transactional');

const mandrill = mailchimpTxFactory(process.env.MANDRILL_API_KEY);

const SENDER = {
  from_email: process.env.MANDRILL_SENDER_EMAIL || 'info@boxingforjustice.org',
  from_name: process.env.MANDRILL_SENDER_NAME || 'Boxing for Justice',
};

const INFO_INBOX = 'info@boxingforjustice.org';

const MANDRILL_SEND_STATUSES = ['sent', 'queued', 'scheduled', 'rejected', 'invalid'];

async function sendMessage(message) {
  const response = await mandrill.messages.send({ message: { ...SENDER, ...message } });

  // The SDK doesn't always reject its promise on failure (e.g. an invalid
  // API key resolves with an Axios-error-shaped object instead of throwing,
  // and instead of the expected per-recipient results array) - detect that
  // explicitly rather than assuming any resolved promise means success.
  if (!Array.isArray(response) || response.length === 0 || !MANDRILL_SEND_STATUSES.includes(response[0]?.status)) {
    throw new Error(response?.message || 'Mandrill did not return a valid send result.');
  }

  const [result] = response;
  if (result.status === 'rejected' || result.status === 'invalid') {
    throw new Error(`Mandrill rejected the message: ${result.reject_reason || result.status}`);
  }

  return response;
}

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
    to: [{ email: userEmail, type: 'to' }],
    subject: 'Purchase Confirmation - Boxing for Justice',
    html: htmlContent,
    text: textContent,
  };
}

async function sendPurchaseConfirmation(userEmail, purchaseDetails) {
  try {
    return await sendMessage(buildPurchaseConfirmationEmail(userEmail, purchaseDetails));
  } catch (error) {
    console.error('Mandrill purchase confirmation email failed:', error.message);
    throw error;
  }
}

const CONTACT_TYPE_LABELS = {
  general: 'General website inquiry',
  training: 'Education / training request',
  partnership: 'Community partnership inquiry',
};

// Notifies BFJ staff of a new contact-form submission (training request,
// partnership inquiry, or the bottom-of-page general contact form).
async function sendContactNotification({ type, name, email, org, phone, comment }) {
  const label = CONTACT_TYPE_LABELS[type] || 'Website inquiry';
  const rows = [
    ['Type', label],
    ['Name', name],
    ['Email', email],
    org ? ['Organization', org] : null,
    phone ? ['Phone', phone] : null,
    comment ? ['Comment', comment] : null,
  ].filter(Boolean);

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px;">
      <h2>${label}</h2>
      <table>${rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#777;">${k}</td><td>${v}</td></tr>`).join('')}</table>
    </div>
  `;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  return sendMessage({
    to: [{ email: INFO_INBOX, type: 'to' }],
    subject: `${label} - ${name}`,
    html,
    text,
  });
}

// Sends the submitter a short kickback confirming BFJ received their message.
async function sendKickback(toEmail, message) {
  return sendMessage({
    to: [{ email: toEmail, type: 'to' }],
    subject: 'Boxing For Justice - we received your message',
    html: `<p>${message}</p>`,
    text: message,
  });
}

// Notifies BFJ staff of a new internship application, with the resume/cover
// letter (if provided) attached directly to the email.
async function sendInternshipApplicationNotification({ position, name, email, phone }, files = []) {
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px;">
      <h2>Internship application: ${position}</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
    </div>
  `;

  return sendMessage({
    to: [{ email: INFO_INBOX, type: 'to' }],
    subject: `Internship application: ${position} - ${name}`,
    html,
    text: `Internship application: ${position}\nName: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}`,
    attachments: files.map((file) => ({
      type: file.mimetype,
      name: file.originalname,
      content: file.buffer.toString('base64'),
    })),
  });
}

async function sendDonationThankYou(toEmail, amount) {
  const message = `Thank you for your $${amount} donation to Boxing For Justice — it makes this work possible.`;
  return sendMessage({
    to: [{ email: toEmail, type: 'to' }],
    subject: 'Thank you for your donation',
    html: `<p>${message}</p>`,
    text: message,
  });
}

module.exports = {
  sendPurchaseConfirmation,
  sendContactNotification,
  sendKickback,
  sendInternshipApplicationNotification,
  sendDonationThankYou,
};
