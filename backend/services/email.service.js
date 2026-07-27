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
/**
 * Send booking confirmation email after a successful appointment creation
 * @param {Object} appointment
 */
export const sendBookingConfirmationEmail = async (appointment) => {
  const { name, email, phone, service, date, notes, reference, amount } =
    appointment;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "To be confirmed";

  const subject = "Booking Confirmed — Dornee Atelier";

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6fa; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6fa; padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 2px 10px rgba(16,22,35,0.06);">

            <!-- Brand bar -->
            <tr>
              <td style="background-color:#101623; padding:20px 32px;">
                <p style="margin:0; font-size:15px; font-weight:700; letter-spacing:0.4px; color:#ffffff;">DORNEE ATELIER</p>
              </td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="padding:32px 32px 8px; text-align:center;">
                <p style="margin:0; font-size:12px; font-weight:600; letter-spacing:0.6px; text-transform:uppercase; color:#8891a3;">Booking Confirmed</p>
                <h1 style="margin:8px 0 0; font-size:20px; font-weight:700; color:#101623;">Thank you, ${name}!</h1>
                <p style="margin:8px 0 0; font-size:14px; color:#4c5567;">Your reservation with Dornee Atelier has been received. Our studio team will follow up within one business day to confirm your fitting time.</p>
              </td>
            </tr>

            <!-- Summary card -->
            <tr>
              <td style="padding:24px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fa; border-radius:10px;">
                  <tr>
                    <td style="padding:20px;">
                      <p style="margin:0 0 12px; font-size:11px; font-weight:600; letter-spacing:0.6px; text-transform:uppercase; color:#8891a3;">Appointment Summary</p>

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:6px 0; font-size:13px; color:#8891a3;">Service</td>
                          <td style="padding:6px 0; font-size:13px; font-weight:600; color:#101623; text-align:right;">${service}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0; border-bottom:1px solid #eef1f8; font-size:13px; color:#8891a3;">Preferred date</td>
                          <td style="padding:6px 0; border-bottom:1px solid #eef1f8; font-size:13px; font-weight:600; color:#101623; text-align:right;">${formattedDate}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0; border-bottom:1px solid #eef1f8; font-size:13px; color:#8891a3;">Booking fee paid</td>
                          <td style="padding:6px 0; border-bottom:1px solid #eef1f8; font-size:13px; font-weight:600; color:#3F6B52; text-align:right;">₵${amount?.toLocaleString() || "—"}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0; border-bottom:1px solid #eef1f8; font-size:13px; color:#8891a3;">Reference</td>
                          <td style="padding:6px 0; border-bottom:1px solid #eef1f8; font-size:13px; font-weight:600; color:#101623; text-align:right; font-family:monospace;">${reference || "—"}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0; border-bottom:1px solid #eef1f8; font-size:13px; color:#8891a3;">Phone</td>
                          <td style="padding:6px 0; border-bottom:1px solid #eef1f8; font-size:13px; font-weight:600; color:#101623; text-align:right;">${phone || "—"}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0; font-size:13px; color:#8891a3;">Email</td>
                          <td style="padding:6px 0; font-size:13px; font-weight:600; color:#101623; text-align:right;">${email}</td>
                        </tr>
                      </table>

                      ${
                        notes
                          ? `<div style="margin-top:12px; padding-top:12px; border-top:1px solid #eef1f8;">
                                <p style="margin:0 0 4px; font-size:11px; font-weight:600; letter-spacing:0.4px; text-transform:uppercase; color:#8891a3;">Your notes</p>
                                <p style="margin:0; font-size:13px; color:#4c5567;">${notes}</p>
                              </div>`
                          : ""
                      }
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:28px 32px 32px; text-align:center; border-top:1px solid #eef1f8;">
                <p style="margin:0; font-size:13px; color:#4c5567;">We're looking forward to creating something beautiful with you.</p>
                <p style="margin:6px 0 0; font-size:12px; color:#8891a3;">Questions? Just reply to this email — we're happy to help.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

  const text = `Booking Confirmed — Dornee Atelier\n\nThank you, ${name}! Your reservation has been received.\n\nService: ${service}\nPreferred date: ${formattedDate}\nBooking fee paid: ₵${amount?.toLocaleString() || "—"}\nReference: ${reference || "—"}\nPhone: ${phone || "—"}\nEmail: ${email}${notes ? `\nNotes: ${notes}` : ""}\n\nWe will follow up within one business day to confirm your fitting time.\n\nThank you for choosing Dornee Atelier.`;

  return sendEmail({ to: email, subject, html, text });
};

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
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Update</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6fa; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6fa; padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 2px 10px rgba(16,22,35,0.06);">

            <!-- Brand bar -->
            <tr>
              <td style="background-color:#101623; padding:20px 32px;">
                <p style="margin:0; font-size:15px; font-weight:700; letter-spacing:0.4px; color:#ffffff;">DORNEE ATELIER</p>
              </td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="padding:32px 32px 8px; text-align:center;">
                <p style="margin:0; font-size:12px; font-weight:600; letter-spacing:0.6px; text-transform:uppercase; color:#8891a3;">Appointment Update</p>
                <h1 style="margin:8px 0 0; font-size:20px; font-weight:700; color:#101623;">Hi ${name}, your status has changed</h1>
              </td>
            </tr>

            <!-- Status change -->
            <tr>
              <td style="padding:24px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fa; border-radius:10px;">
                  <tr>
                    <td align="center" style="padding:20px;">
                      <span style="font-size:13px; color:#8891a3; text-decoration:line-through;">${oldLabel}</span>
                      <div style="margin:8px 0;">
                        <span style="display:inline-block; padding:6px 16px; border-radius:999px; font-size:13px; font-weight:700; color:#ffffff; background-color:${color};">
                          ${newLabel}
                        </span>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Details -->
            <tr>
              <td style="padding:16px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:12px 0; border-bottom:1px solid #eef1f8; font-size:13px; color:#8891a3;">Service</td>
                    <td style="padding:12px 0; border-bottom:1px solid #eef1f8; font-size:13px; font-weight:600; color:#101623; text-align:right;">${service}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0; border-bottom:1px solid #eef1f8; font-size:13px; color:#8891a3;">Date</td>
                    <td style="padding:12px 0; border-bottom:1px solid #eef1f8; font-size:13px; font-weight:600; color:#101623; text-align:right;">${date || "—"}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0; font-size:13px; color:#8891a3;">Email</td>
                    <td style="padding:12px 0; font-size:13px; font-weight:600; color:#101623; text-align:right;">${email}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:28px 32px 32px; text-align:center; border-top:1px solid #eef1f8; margin-top:8px;">
                <p style="margin:16px 0 0; font-size:13px; color:#4c5567;">Thank you for choosing Dornee Atelier.</p>
                <p style="margin:4px 0 0; font-size:12px; color:#8891a3;">Questions? Just reply to this email — we're happy to help.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

  const text = `Your appointment status has been updated from ${oldLabel} to ${newLabel}.\n\nClient: ${name}\nService: ${service}\nDate: ${date || "—"}\n\nThank you for choosing Dornee Atelier.`;

  return sendEmail({ to: email, subject, html, text });
};
