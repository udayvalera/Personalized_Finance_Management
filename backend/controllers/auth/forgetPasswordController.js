const User = require('../models/User'); // Import the User model
const bcrypt = require('bcryptjs');
const { generateOTP } = require('../utils/otpUtils'); // Import the generateOTP function
const { sendOTPEmail } = require('../utils/emailUtils'); // Import the sendOTPEmail function

// Forgot Password controller
const forgotPasswordController = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP using the utility function
        const otp = generateOTP();

        // Set OTP expiration time (e.g., 10 minutes from now)
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update the user with the new OTP and expiration time
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP to the user's email using the utility function
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        // Respond with success message
        res.status(200).json({
            message: 'OTP sent to your email. Please check your email to reset your password.',
        });
    } catch (error) {
        console.error('Error during forgot password process:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Reset Password controller
const resetPasswordController = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the OTP is valid and not expired
        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear the OTP fields
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        // Respond with success message
        res.status(200).json({
            message: 'Password reset successfully.',
        });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { forgotPasswordController, resetPasswordController };