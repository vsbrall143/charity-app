const User = require('../models/User');
const Charity = require('../models/Charity');
require('dotenv').config();


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving users', details: err.message });
  }
};

exports.approveCharity = async (req, res) => {
  try {
    const { charityId } = req.params;

    await Charity.update({ approved: true }, { where: { id: charityId } });

    res.status(200).json({ message: 'Charity approved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error approving charity', details: err.message });
  }
};


const reportService = require('../services/reportService');

exports.getCharityReport = async (req, res) => {
  const { charityId } = req.params;

  try {
    const report = await reportService.generateImpactReport(charityId);
    res.status(200).json({ report });
  } catch (err) {
    res.status(500).json({ error: 'Error generating report', details: err.message });
  }
};
