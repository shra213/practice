const express = require('express');
const router = express.Router();
const zod = require('zod');
const mongoose = require('mongoose');
const Account = require('../models/transactions.models');
const ApiError = require('../utils/ApiError');
const authMiddleware = require('../middleware/userMiddle');
const accountSchema = zod.object({
    balance: zod.number()
})

// {
//     "userId":"67f8f5d4e5ad1b4bfd6663fe",
//     "amount":300
// }


router.get('/checkbal', authMiddleware, async (req, res, next) => {
    try {
        const user = req.user;
        const account = await Account.findOne({ userID: user._id });
        console.log(account);
        if (!account) {
            throw new ApiError(404, 'account not found');
        }
        return res
            .status(200)
            .json({ msg: `account balance is ${account.balance / 1000}` ,balance: account.balance / 1000 });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
})

router.post('/transfer', authMiddleware, async (req, res, next) => {
    console.log("transfer money");
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = req.user;
        const totransfer = req.body.userId;
        const result = accountSchema.safeParse(req.body.amount);
        if(!result){
            throw new ApiError(400, "balance validation error from me");
        }
        
        const amount = req.body.amount;
;        if (!totransfer || !amount ||isNaN(amount)) {
            throw new ApiError(400, "userid & amount is required");
        }
        const userAcc = await Account.findOne({ userID: user._id }).session(session );
        const toAcc = await Account.findOne({ userID: totransfer }).session( session );
        if (!userAcc || !toAcc) {
            throw new ApiError(404, 'account not found');
        }
        
        if (userAcc.getBal() < amount * 1000) {
            throw new ApiError(400, "inefficient balance");
        }
        userAcc.balance -= amount * 1000;
        console.log(userAcc.balance);
        toAcc.balance += amount * 1000;
        console.log(toAcc.balance);
        console.log("hii");
        await userAcc.save({ session });
        await toAcc.save({ session });

        await session.commitTransaction();
        console.log("transaction Successfull");
        return res
            .status(200)
            .json({msg : "success"});
    } catch (error) {
        await session.abortTransaction();
        console.log(error.message);
        next(error);
    } finally {
        session.endSession();
        return;
    }
})
module.exports = router;