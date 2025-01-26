const jwt = require('jsonwebtoken');

// Hardcoded JWT secret (replace with a strong secret in production)
const JWT_SECRET = 'your_strong_jwt_secret_key_here';

// Function to generate a JWT token
const generateToken = (payload) => {
    try {
        // Sign the token with the payload, secret key, and expiration time
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Failed to generate token');
    }
};

// Function to verify a JWT token
const verifyToken = (token) => {
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Invalid or expired token');
    }
};

module.exports = {
    generateToken,
    verifyToken,
};