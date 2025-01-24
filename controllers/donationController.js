const Donation = require('../models/Donation');
const Charity = require('../models/Charity');
const paymentService = require('../services/paymentService'); // Abstracted payment logic

exports.processDonation = async (req, res) => {
  try {
    const { amount, charityId } = req.body;

    // Process payment through a payment gateway (e.g., Stripe/Razorpay)
    const paymentResponse = await paymentService.processPayment(req.user, amount);

    if (!paymentResponse.success) {
      return res.status(400).json({ error: 'Payment failed' });
    }

    // Save donation to database
    const donation = await Donation.create({
      amount,
      user_id: req.user.id,
      charity_id: charityId,
    });

    res.status(201).json({ message: 'Donation processed successfully', donation });
  } catch (err) {
    res.status(500).json({ error: 'Error processing donation', details: err.message });
  }
};

exports.getDonationsByCharity = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: { charity_id: req.params.charityId },
    });

    res.status(200).json({ donations });
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving donations', details: err.message });
  }
};
