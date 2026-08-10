const jwt = require('jsonwebtoken');
const { createError } = require('../constants/errors.constant');
const { AUTH_ERRORS } = require('../constants/index');

const generateAccessToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const generateRefreshToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw createError(AUTH_ERRORS.INVALID_TOKEN);
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken
};

