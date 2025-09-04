const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



const createAccessToken = async (payload) => {
    const Access_token=  jwt.sign(payload, process.env.Access_token, { expiresIn: '1d' });
    return Access_token;
}

const createRefreshToken = async (payload) => {
    const Refresh_token=   jwt.sign(payload, process.env.Refresh_token, { expiresIn: '7d' });
    return Refresh_token;
}

module.exports = { createAccessToken, createRefreshToken };