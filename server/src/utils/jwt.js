import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token for authenticated users
 * 
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {string} - Signed JWT token
 */
export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token valid for 30 days
    });
};

/**
 * Verify JWT Token
 * 
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
