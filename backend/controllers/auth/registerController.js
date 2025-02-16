const User = require('../../models/User'); // Import the User model
const bcrypt = require('bcryptjs');
const { generateOTP } = require('../../utils/otpUtils'); // Import the generateOTP function
const { sendOTPEmail } = require('../../utils/emailUtils'); // Import the sendOTPEmail function

// Register controller
const registerController = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the email or username is already registered
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP using the utility function
        const otp = generateOTP();

        // Set OTP expiration time (e.g., 10 minutes from now)
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        // Create a new user with isVerified: false
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            otp, // Store the OTP in the database for verification
            otpExpires, // Store the OTP expiration time
        });

        console.log('Current Time:', new Date());
        console.log('OTP Expires:', otpExpires);
        // Save the user to the database
        await newUser.save();

        // Send OTP to the user's email using the utility function
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        // Respond with success message
        res.status(201).json({
            message: 'User registered successfully. Please check your email for the OTP to verify your account.',
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = registerController;