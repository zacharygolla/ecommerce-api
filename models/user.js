const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'User must have first name']
    } ,   
    email: {
        type: String,
        required: [true, 'User must have an email address'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email address'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
        minlength: 4,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createAt: {
        type: Date,
        default: Date.now
    },
    orders: {
        type: [mongoose.Schema.ObjectId],
        ref: "Order",
        required: false
    }
});

//Encrypt user password using bcrypt
UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
}

//Match user entered password with hashed password in database
UserSchema.methods.matchPassword = async function(passwordInputValue) {
    return await bcrypt.compare(passwordInputValue, this.password);
}

//Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //Set expire to 30 minutes
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken;

}

module.exports = mongoose.model('User', UserSchema);