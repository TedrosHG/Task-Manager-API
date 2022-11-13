const User = require('../models/user')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    const { email, password } = req.body
    // create user 
    console.log(email, password)
    if (!email) {
        return res.status(400).json({ err: "email is required" })
    }
    await User.findOne({ email, status: true })
        .then(async (user) => {
            if (user) {
                console.log("This email is already taken")
                return res.status(400).json({ err: "This email is already taken" })
            } else {
                await User.create({ ...req.body })
                    .then((result) => {
                        // create JWT token
                        const token = result.createJWT()
                        // send the result to front end
                        console.log('register successful')
                        return res.status(201).json({ email: result.email, Token: token })

                    })
                    .catch((err) => {
                        console.log(err.message)
                        return res.status(400).json({ err: err.message })

                    })

            }
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(400).json({ err: err.message })
        })


}


const login = async (req, res) => {
    const { email, password } = req.body
    //console.log(email.toLowerCase())
    //console.log(email.trim())
    console.log(req.body)
    // check require email and password
    if (!email || !password) {
        console.log(`please provide all input`)
        return res.status(400).json({ err: "please provide all input" })
    }

    // check user with this email
    await User.findOne({ email, status: true })
        .then(async (user) => {
            if (!user) {
                console.log(`Invalid Credentials(email)`)
                return res.status(400).json({ err: `Invalid Credentials` })
            }
            // check password
            const checkPassword = await user.comparePassword(password)
                .catch((err) => {
                    console.log(err.message)
                })
            if (!checkPassword) {
                console.log(`Invalid Credentials(password)`)
                return res.status(400).json({ err: `Invalid Credentials` })
            }

            // create token
            const token = user.createJWT()
            // send result to front end
            console.log('login successful')
            return res.status(200).json({ email: user.email, Token: token })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(400).json({ err: err.message })
        })



}

const sendEmail = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ err: 'Email is required' })
    }
    // check user with this email
    const user = await User.findOne({ email, status: true })
        .then((user) => {
            if (!user) {
                console.log(`there is no user with this email`)
                return res.status(400).json({ err: `there is no user with this email` })
            } else {
                //generate four digit number 
                var code = Math.floor(1000 + Math.random() * 9000);

                var transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 587, false for other ports
                    requireTLS: true,
                    auth: {
                        user: process.env.MY_EMAIL,
                        pass: process.env.MY_PASSWORD
                    }
                });

                var mailOptions = {
                    from: process.env.MY_EMAIL,
                    to: req.body.email,
                    subject: 'Reset password for todo app',
                    text: `Reset password for todo app
        The code is : ${code}
        The code will expire in 1 hour.`
                };

                transporter.sendMail(mailOptions, async function (error, info) {
                    if (error) {
                        console.log(error);
                        return res.status(400).json({ err:error.message })
                    } else {
                        const vCode = user.createVerificationCode(code);
                        await User.findByIdAndUpdate(user._id, { otp: vCode })
                            .catch((err) => {
                                console.log(err.message, "not send")
                                return res.status(400).json({ err: err.message })
                            })
                        console.log('Email sent: ' + info.response);
                        return res.status(200).json({
                            msg: "Email send successfully",
                            email
                        })
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(400).json({ err: err.message })
        })

}

const checkCode = async (req, res) => {
    const { email, code } = req.body
    if (!email) {
        return res.status(400).json({ err: 'Email is required' })
    }
    if (code.length != 4) {
        return res.status(400).json({ err: 'code must be 4 characters' })
    }
    const user = await User.findOne({ email, status: true }).catch((err) => {
        console.log(err.message)
        return res.status(400).json({ err: err.message })
    })
    if (!user) {
        console.log(`there is no user with this email`)
        return res.status(400).json({ err: `there is no user with this email` })
    }
    try {
        const payload = jwt.verify(user.otp, process.env.OTP_SECRET)
        if (payload.otp == code) {
            const forgotToken = user.createforgotPasswordToken()
            return res.status(200).json({
                msg: "code matched",
                token: forgotToken,
            })
        } else {
            return res.status(400).json({
                err: "wrong code, try again."
            })
        }
    } catch (err) {
        return res.status(400).json({ err: err.message })
    }


}

const newPassword = async (req, res) => {
    const { email, password, token } = req.body
    console.log('email: ', email, 'password: ', password, 'token: ', token)
    if (!email) {
        return res.status(400).json({ err: 'Email is required' })
    }
    if (!token) {
        return res.status(400).json({ err: 'token is required' })
    }
    if (password.length < 8) {
        return res.status(400).json({ err: 'password must be 8 or more characters' })
    }
    try {
        jwt.verify(token, process.env.FORGOT_PASSWORD_SECRET)
        const salt = await bcrypt.genSalt(10)
        await bcrypt.hash(password, salt)
            .then(async (hashedPassword) => {
                await User.findOneAndUpdate({ email, status:true }, { password: hashedPassword })
                    .then((user) => {
                        if (!user) {
                            console.log(`there is no user with this email`)
                            return res.status(400).json({ err: `there is no user with this email` })
                        }
                        return res.status(200).json({
                            msg: "password changed successfully"
                        })
                    })
                    .catch((err) => {
                        console.log(err.message)
                        return res.status(400).json({ err: err.message })
                    })

            })

    } catch (err) {
        return res.status(400).json({ err: err.message })
    }

}



// Export controller
module.exports = { register, login, sendEmail, checkCode, newPassword }