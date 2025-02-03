// const emailService = require('../services/emailService'); // Abstracted email logic
require('dotenv').config();

exports.sendDonationReceipt = async (req, res) => {
  try {
    const { email, donationDetails } = req.body;

    await emailService.sendEmail({
      to: email,
      subject: 'Donation Receipt',
      text: `Thank you for your donation! Here are the details: ${JSON.stringify(donationDetails)}`,
    });

    res.status(200).json({ message: 'Receipt sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error sending receipt', details: err.message });
  }
};

const emailService = require('../services/emailService');

exports.sendDonationReceipt = async (req, res) => {
  const { email, donationDetails } = req.body;

  try {
    await emailService.sendEmail({
      to: email,
      subject: 'Donation Receipt',
      text: `Thank you for your donation! Amount: $${donationDetails.amount}`,
    });

    res.status(200).json({ message: 'Receipt sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error sending receipt', details: err.message });
  }
};

// const paymentService = require('../services/paymentService');

exports.processDonation = async (req, res) => {
  const { amount, charityId } = req.body;

  try {
    const paymentResponse = await paymentService.processPayment(req.user, amount);

    if (!paymentResponse.success) {
      return res.status(400).json({ error: 'Payment failed', details: paymentResponse.error });
    }

    // Save donation details after successful payment
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
