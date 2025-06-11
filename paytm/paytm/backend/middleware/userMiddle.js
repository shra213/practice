const ApiError = require('../utils/ApiError');
const { User } = require('../models/user.models');
const jwt = require('jsonwebtoken');


const authMiddleware = async (req, res, next) => {
    try {
        // const token = req.headers['authorization']?.split(' ')[1];
        console.log("middleware");
        const token = req.headers['authorization']?.split(' ')[1]||req.cookies?.accessToken;

        // const token = req.cookies?.accessToken||req.header('authorization')?.replace('Bearer ', '');
        console.log("Token:", token);

        if (!token) {
            throw new ApiError(401, 'Token not found');
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id).select('-password -refreshToken');
        if (!user) {
            throw new ApiError(401, 'User not found/Invalid aceess token');
        }
        req.user = user;
        console.log('User found:', user._id);
        console.log('Decoded token:', decoded);
        next();
    }catch (error) {
        next(error);
    }
}
module.exports = authMiddleware;