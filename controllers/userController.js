const User = require('../models/User');
const Charity = require('../models/Charity');

require('dotenv').config();

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





 
exports.getCharityProfile = async (req, res) => {
  try {
    const user = await Charity.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'Charity not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving Charity profile', details: err.message });
  }
};

exports.updateCharityProfile = async (req, res) => {
  try {
 
    const { name, email , mission} = req.body;
    console.log(req.body);
 
    await Charity.update(
      { name, email , mission},
      { where: { id: req.user.id } }
    );

    res.status(200).json({ message: 'Charity updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating charity', details: err.message });
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
