const FinancialProfile = require('../../models/FinancialProfile');
const User = require('../../models/User');
// Handle form submission for financial profile
const addFinancialInfo = async (req, res) => {
  const { monthlyIncome, currentDebts, investmentPortfolio, primaryFinancialGoal } = req.body;
  const userId = req.user.id; // Fetch userId from authenticated user

  try {
    // Check if a financial profile already exists for the user
    const existingProfile = await FinancialProfile.findOne({ userId });
    const user = await User.findById({ _id: userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Financial profile already exists for this user.' });
    }

    // Create a new financial profile
    const newFinancialProfile = new FinancialProfile({
      userId,
      monthlyIncome,
      currentDebts,
      investmentPortfolio,
      primaryFinancialGoal,
    });

    // Save the profile to the database
    await newFinancialProfile.save();

    // Update the user's hasFilledAdditionalInfo field to true
    user.hasFilledAdditionalInfo = true;
    await user.save();
    // Respond with success message
    res.status(201).json({ message: 'Financial profile created successfully!', profile: newFinancialProfile });
  } catch (error) {
    console.error('Error saving financial profile:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = { addFinancialInfo };