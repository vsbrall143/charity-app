const User = require('../models/User');
const Donation = require('../models/Donation');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving user profile', details: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    await User.update(
      { name, email },
      { where: { id: req.user.id } }
    );

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating profile', details: err.message });
  }
};

exports.getDonationHistory = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: { user_id: req.user.id },
      include: ['Charity'],
    });

    res.status(200).json({ donations });
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving donation history', details: err.message });
  }
};
