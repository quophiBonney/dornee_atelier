import nodemailer from "nodemailer";

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text fallback
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.MAIL_FROM || '"Dornee Atelier" <noreply@dornee.com>',
      to,
      subject,
      html,
      text: text || "",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Email send failed:", error);
    // Don't throw - email failures shouldn't break the main flow
    return null;
  }
};

/**
 * Send appointment status update email
 * @param {Object} appointment
 * @param {string} oldStatus - Previous status
 */
export const sendAppointmentStatusEmail = async (appointment, oldStatus) => {
  const { name, email, service, date, status } = appointment;

  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const statusColors = {
    pending: "#ffb84d",
    confirmed: "#2ee6a6",
    completed: "#5ca8ff",
    cancelled: "#ff5c7a",
  };

  const newLabel = statusLabels[status] || status;
  const oldLabel = statusLabels[oldStatus] || oldStatus;
  const color = statusColors[status] || "#8b95ac";

  const subject = `Appointment Status Updated - ${newLabel}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', -apple-system, sans-serif; background: #f5f7fa; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 0 auto; padding: 32px 20px; }
        .card { background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
        .header { text-align: center; margin-bottom: 28px; }
        .header h1 { font-size: 22px; font-weight: 700; color: #101623; margin: 0; }
        .header p { font-size: 14px; color: #4c5567; margin: 6px 0 0; }
        .status-badge { display: inline-block; padding: 6px 18px; border-radius: 999px; font-size: 13px; font-weight: 600; color: white; margin: 12px 0; }
        .details { margin: 24px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eef1f8; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-size: 13px; color: #8891a3; }
        .detail-value { font-size: 13px; font-weight: 600; color: #101623; }
        .status-change { background: #f5f7fa; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center; }
        .status-change .old { color: #8891a3; font-size: 13px; }
        .status-change .arrow { color: #8891a3; font-size: 18px; margin: 4px 0; }
        .status-change .new { font-size: 15px; font-weight: 700; }
        .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #8891a3; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <h1>Appointment Update</h1>
            <p>Your appointment with Dornee Atelier has been updated</p>
          </div>

          <div style="text-align: center; margin: 16px 0;">
            <div class="status-badge" style="background: ${color};">
              ${newLabel}
            </div>
          </div>

          <div class="status-change">
            <div class="old">${oldLabel}</div>
            <div class="arrow">→</div>
            <div class="new" style="color: ${color};">${newLabel}</div>
          </div>

          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Client</span>
              <span class="detail-value">${name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service</span>
              <span class="detail-value">${service}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">${date || "—"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email</span>
              <span class="detail-value">${email}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for choosing Dornee Atelier</p>
            <p style="margin-top: 4px;">If you have any questions, please contact us.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Your appointment status has been updated from ${oldLabel} to ${newLabel}.\n\nClient: ${name}\nService: ${service}\nDate: ${date || "—"}\n\nThank you for choosing Dornee Atelier.`;

  return sendEmail({ to: email, subject, html, text });
};
