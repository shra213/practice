const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/user.models');
const Account = require('../models/transactions.models');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const ApiError = require('../utils/ApiError');
const authMiddleware = require('../middleware/userMiddle');
const signUpSchema = zod.object({
    username: zod.string().min(1, 'userName is required'),
    fullname: zod.string().min(1, 'Last name is required'),
    email: zod.string().email('Invalid email format'),
    password: zod.string().min(6, 'Password must be at least 6 characters long'),
});
router.post('/sign_up', async (req, res, next) => {
    try {

        console.log('Request body:', req.body);
        const { success } = signUpSchema.safeParse(req.body);
        if (!success) {
            console.log('Validation error:', signUpSchema.safeParse(req.body).error.errors);
            console.log('Validation error:');
            throw new ApiError(400, 'Validation error');
        }
        const { username, fullname, email, password } = req.body;
        const existing = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });
        if (existing) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        try {
            const createdUser = await User.create({
                username,
                fullname,
                email,
                password,
            });

            if (!createdUser) {
                throw new ApiError(400, 'User not created');
            }

            const userAcc = await Account.create({
                userID: createdUser._id,
            });

            if (!userAcc) {
                throw new ApiError(400, 'Account not created');
            }

            const acc = await Account.findById(userAcc._id).populate('userID');
            console.log("populated", acc.userID);
            // console.log(userAcc);
            const temp = createdUser.toObject();
            delete temp.password;
            const safeUser = temp;
            return res
                .status(201)
                .json({ user: safeUser });

        } catch (error) {
            console.log('Error creating user:', error.message);
            throw new ApiError(500, 'Error creating user');
        }

    } catch (error) {
        console.log(error.message);
        next(error);
    }
});
router.get("/shraddha", (req, res, next) =>{
    console.log("hiii");
    return res
        .cookie(msg,"hii this saving msg", {httpOnly: true,secure:false})
        .json({msg:"yess"});
})
router.post('/login', async (req, res, next) => {
    try {
        console.log("heyyy");
        const { email, password } = req.body;
        console.log('Request body:', req.body);
        if (!email || !password) {
            throw new ApiError(400, 'All fields are required');
        }
        const user = await User.findOne({
            email
            // $or: [
            //     { email },
            //     { username }
            // ]
        });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        if (!user.checkPass(password)) {
            throw new ApiError(401, 'Invalid password');
        }
        const access = user.generateAccessToken();
        const refresh = user.generateRefreshToken();
        user.refreshToken = refresh;
        await user.save();
        const options = {
            httpOnly: true,
            secure: true, // Set to true in production
            // sameSite: 'Lax'
        };
        const temp = user.toObject();
        delete temp.password;
        delete temp.refreshToken;
        const safeUser = temp;

        return res
            .status(200)
            .cookie('accessToken', access, options)//just for testing purpose, in production we will use refresh token for getting new access token
            .cookie('refreshToken', refresh, options)
            .json({ user: safeUser, accessToken: access });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

router.post('/logout', async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        const user = await User.findOne({ refreshToken: token });
        if (!user) {
            throw new ApiError(404, 'User not found/Invalid refresh token/Token expired');
        }
        user.refreshToken = null;
        await user.save();
        return res
            .status(200)
            .clearCookie('accessToken', { httpOnly: true, secure: true })
            .clearCookie('refreshToken', { httpOnly: true, secure: true })
            .json({
                message: 'Logged out successfully',
                userid: user._id
            });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
})

router.post('/update', authMiddleware, async (req, res, next) => {
    try {
        const toUpadate = req.body;
        const user = await User.findById(req.user._id);
        const allowedUpdates = ['firstname', 'lastname', 'email'];
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        Object.keys(toUpadate).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                user[key] = toUpadate[key];
            }
        });
        if (toUpadate.password) {
            user.password = toUpadate.password;
        }
        await user.save();
        return res
            .status(200)
            .json({ message: 'User updated successfully' });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

router.get('/refresh', async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            throw new ApiError(401, 'Refresh token not found');
        }
        const user = await User.findOne({ refreshToken: token });
        if (!user) {
            throw new ApiError(401, 'Invalid refresh token/Token expired');
        }
        const access = user.generateAccessToken();
        return res
            .status(200)
            .cookie('accessToken', access, {
                httpOnly: true,
                secure: true, // Set to true in production
            })
            .json({ accessToken: access });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});
router.get('/tokenvalid', async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header('authorization')?.replace('Bearer ', '') || req.body;
        console.log("Token:", token);
        if (!token || token.length < 7) {
            throw new ApiError(401, 'Access token not found');
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded.id).select('-password -refreshToken');
        if (!user) {
            throw new ApiError(401, 'User not found/Invalid access token');
        }
        return res
            .status(200)
            .json({ message: 'Access token is valid' ,user});
    } catch (error) {
        console.log(error.message);
        console.log("Error decoding token:", error.message);

        return res
            .status(401)
            .json({ message: 'Invalid access token' });
    }
});

router.get('/getUsers', authMiddleware, async (req, res, next) => {
    try {
        const user = req.user;
        const users = await User.find({}, '-password -refreshToken');
        if (!users) {
            throw new ApiError(404, 'No users found');
        }
        const newUsers = users.filter((ele) => ele.email !== user.email
            // if(ele.email !== user.email){
            //     return true;
            // }
            // return false;
        );
        console.log(`real ${user}`);

        console.log(newUsers);
        return res
            .status(200)
            .json({ newUsers });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

module.exports = router; 