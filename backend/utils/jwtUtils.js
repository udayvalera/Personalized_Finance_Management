const { verify } = require('crypto');
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
        // Log the error and return null instead of throwing an error
        console.error('Error verifying token:', error);
        return null;  // Or you can return a custom error message
    }
};

module.exports = {
    generateToken,
    verifyToken,
};
