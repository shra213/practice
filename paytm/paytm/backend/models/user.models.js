const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true
    },
    fullname: {
        type: String, 
        required: true
    },
    email: {
        type : String,
        required: true,
        unique: true,   
    },
    password:{ 
        type : String, 
        required: true 
    },
    refreshToken: {
        type: String,
    },
})

userSchema.pre('save', async function(next) {
    console.log('Pre-save hook triggered:', this);
    if (!this.isModified('password')) {
        return next(); // Skip hashing if password is not modified
    }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    console.log(hashedPassword);
    next(); // optional, but fine to keep
  } catch (err) {
    next(err); // pass error to Express
  }
});
userSchema.post('save', function(doc) {
    console.log('User created:', doc._id);
});
userSchema.methods.checkPass = async function(password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function() {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}
userSchema.statics.findByEmail = async function(email) {
    return await this.findOne({ email });
}
const User = mongoose.model('User', userSchema);
exports.User = User;