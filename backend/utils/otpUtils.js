const crypto = require('crypto');

// Generate a 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Validate OTP (compare user-provided OTP with stored OTP)
const validateOTP = (userOTP, storedOTP) => {
    return userOTP === storedOTP;
};

module.exports = {
    generateOTP,
    validateOTP,
};