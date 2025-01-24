const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Processes a payment using Stripe.
 * @param {Object} user - The user object making the payment.
 * @param {number} amount - The payment amount in smallest currency unit (e.g., cents for USD).
 * @returns {Object} - Payment confirmation details.
 */
exports.processPayment = async (user, amount) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in the smallest currency unit (e.g., cents)
      currency: 'usd', // Change currency as needed
      payment_method_types: ['card'],
      receipt_email: user.email,
    });

    return {
      success: true,
      paymentIntent,
    };
  } catch (err) {
    console.error('Error processing payment:', err.message);
    return {
      success: false,
      error: err.message,
    };
  }
};
