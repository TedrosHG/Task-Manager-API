const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide Email address'],
        unique: true,
        trim:true,
        lowercase:true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
    },
    password:{
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8,
    },
    otp:{
        type: String,   
    },
    fullName:{
        type: String,   
    },
    phoneNumber:{
        type: String,   
    },
    gender:{
        type: String, 
        enum: ["Male", "Female", ""],
        default: "",  
    },
    DoB:{
        type: Date,   
    },
    img:{
        type: String,   
    },
    status:{
        type: Boolean,   
    },
    reason:{
        type: String,   
    }

})

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    //console.log(this.password.trim())
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
    // console.log(newPassword.trim())
    // console.log(newPassword)
    const isMatch = await bcrypt.compare(newPassword, this.password)
    return isMatch;
}

UserSchema.methods.createVerificationCode = function(code) {
    return jwt.sign(
        { otp: code, },
        process.env.OTP_SECRET,
        { expiresIn: 3600, }
    )
}

UserSchema.methods.createforgotPasswordToken = function() {
    return jwt.sign(
        {  },
        process.env.FORGOT_PASSWORD_SECRET,
        { expiresIn: 3600, }
    )
}

// Export model
module.exports = mongoose.model('User', UserSchema)