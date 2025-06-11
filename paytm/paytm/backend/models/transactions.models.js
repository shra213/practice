const mongoose = require('mongoose');
const { number } = require('zod');
const accountSchema = new mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        reuired: true
    },
    balance : {
        type : Number,
        required : true,
        default : 1000000
    }
})
accountSchema.methods.getBal = async function(){
    return this.balance / 1000;
}
const Account = mongoose.model('account', accountSchema);
module.exports = Account;