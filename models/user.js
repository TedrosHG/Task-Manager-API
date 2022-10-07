const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide Email address'],
        unique: [true, 'Please provide unique Email'],
    },
    password:{
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8,
    }

})

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt) 
})

UserSchema.methods.createJWT = function() {
    return jwt.sign(
        { userId: this._id, },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME, }
    )
}

UserSchema.methods.comparePassword = async function(newPassword) {
    const isMatch = await bcrypt.compare(newPassword, this.password)
    return isMatch;
}

// Export model
module.exports = mongoose.model('User', UserSchema)