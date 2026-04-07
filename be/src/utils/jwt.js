const jwt = require('jsonwebtoken');
const { createError } = require('../constants/errors.constant');
const { AUTH_ERRORS } = require('../constants/index');

const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw createError(AUTH_ERRORS.INVALID_TOKEN);
    }
};

module.exports = {
    generateToken,
    verifyToken
};

