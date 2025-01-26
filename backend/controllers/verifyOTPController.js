const User = require('../models/User');
const { validateOTP } = require('../utils/otpUtils'); // Import the validateOTP function

const verifyOTPController = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Log the OTP and expiration time for debugging
        console.log('Stored OTP:', user.otp);
        console.log('OTP Expires:', user.otpExpires);
        console.log('Current Time:', new Date());

        // Check if the OTP has expired
        if (user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Validate the OTP using the utility function
        if (!validateOTP(otp, user.otp)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Mark the user as verified
        user.isVerified = true;
        user.otp = null; // Clear the OTP after verification
        user.otpExpires = null; // Clear the OTP expiration time
        await user.save();

        // Respond with success message
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = verifyOTPController;