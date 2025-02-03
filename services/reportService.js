// const Donation = require('../models/Donation');
const Charity = require('../models/Charity');

/**
 * Generates an impact report for a specific charity.
 * @param {string} charityId - The ID of the charity.
 * @returns {Object} - An object containing the charity's impact report.
 */
exports.generateImpactReport = async (charityId) => {
  try {
    // Fetch the charity details
    const charity = await Charity.findByPk(charityId);
    if (!charity) {
      throw new Error('Charity not found');
    }

    // Fetch donations for the charity
    const donations = await Donation.findAll({ where: { charity_id: charityId } });
    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);

    // Generate the impact report
    const report = {
      charity: charity.name,
      description: charity.description,
      goal: charity.goal,
      totalDonations,
      impactSummary: `Total donations received: $${totalDonations} out of a goal of $${charity.goal}.`,
    };

    return report;
  } catch (err) {
    console.error('Error generating impact report:', err.message);
    throw new Error('Failed to generate impact report');
  }
};

/**
 * Generates a user donation summary.
 * @param {string} userId - The ID of the user.
 * @returns {Object} - An object containing the user's donation history and summary.
 */
exports.generateUserDonationSummary = async (userId) => {
  try {
    const donations = await Donation.findAll({ where: { user_id: userId } });

    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const donationDetails = donations.map((donation) => ({
      amount: donation.amount,
      charityId: donation.charity_id,
      date: donation.createdAt,
    }));

    return {
      totalDonations,
      donationDetails,
    };
  } catch (err) {
    console.error('Error generating user donation summary:', err.message);
    throw new Error('Failed to generate donation summary');
  }
};
