// // const sgMail = require('@sendgrid/mail');

// // Set the SendGrid API Key
// // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// /**
//  * Sends an email using SendGrid.
//  * @param {Object} emailData - The email data object.
//  * @param {string} emailData.to - Recipient email address.
//  * @param {string} emailData.subject - Email subject line.
//  * @param {string} emailData.text - Plain text content.
//  * @param {string} [emailData.html] - Optional HTML content.
//  */
// exports.sendEmail = async ({ to, subject, text, html }) => {
//   try {
//     const message = {
//       to,
//       from: process.env.SENDGRID_FROM_EMAIL, // Sender email (configured in SendGrid)
//       subject,
//       text,
//       html,
//     };

//     await sgMail.send(message);
//     console.log(`Email sent to ${to}`);
//   } catch (err) {
//     console.error('Error sending email:', err.message);
//     throw new Error('Failed to send email');
//   }
// };
