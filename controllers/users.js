const User = require('../models/user')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    const { email, password } = req.body
    // create user 
    console.log(email,password)
    await User.create({ ...req.body})
    .then((result) => {
        // create JWT token
        const token = result.createJWT()
        // send the result to front end
        res.status(201).json({ email:result.email, Token:token })
        console.log('register successful')
    })
    .catch((err) => {
        if(err.code === 11000){ // check for deplicated key (email)
             console.log("This email is already taken")
            res.status(400).json({err:"This email is already taken"})
        }else{
             console.log(err.message)
            res.status(400).json({err:err.message}) 
        }
        
    })
    
}


const login = async (req, res) => {
    const { email, password } = req.body
    //console.log(email.toLowerCase())
    //console.log(email.trim())
    console.log(email,password)
    // check require email and password
    if(!email || !password){
        console.log( `please provide all input`)
        return res.status(400).json({err: "please provide all input"})
    }

    // check user with this email
    const user = await User.findOne({email}).catch((err) => {
        console.log(err.message)
        res.status(400).json({err:err.message})
    })
    if(!user){
        console.log( `Invalid Credentials(email)`)
        return res.status(400).json({err: `Invalid Credentials`})
    }
    // check password
    const checkPassword = await user.comparePassword(password)
    .catch((err) => {
        console.log(err.message)
    })
    if(!checkPassword){
        console.log( `Invalid Credentials(password)`)
        return res.status(400).json({err: `Invalid Credentials`})
    }

    // create token
    const token = user.createJWT()
    // send result to front end
    res.status(200).json({ email:user.email, Token:token })
    console.log('login successful')

}  

const sendEmail = async(req, res) => {
    const { email } = req.body
    if(!email){
        res.status(400).json({err:'Email is required'})
    }
    // check user with this email
    const user = await User.findOne({ email }).catch((err) => {
        console.log(err.message)
        res.status(400).json({err:err.message})
    })
    if(!user){
        console.log( `there is no user with this email`)
        return res.status(400).json({err: `there is no user with this email`})
    }else{
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
    text:  `Reset password for todo app
    The code is : ${code}
    The code will expire in 1 hour.`
  };

  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log(error);
      res.status(400).json({error})
    } else {
      const vCode = user.createVerificationCode(code);
      await User.findByIdAndUpdate(user._id,{otp:vCode})
      .catch((err) => {
        console.log(err.message,"not send")
        res.status(400).json({err:err.message})
            })
      console.log('Email sent: ' + info.response);
      res.status(200).json({
        msg:"Email send successfully"
    })
    }
  }); 
    }
}

const checkCode = async(req, res) => {
    const {  email, code } = req.body
    if(code.length != 4){
        res.status(400).json({err:'code must be 4 characters'})
    }
    const user = await User.findOne({email}).catch((err) => {
        console.log(err.message)
        res.status(400).json({err:err.message})
    })
    if(!user){
        console.log( `there is no user with this email`)
        return res.status(400).json({err: `there is no user with this email`})
    }
    try{
    const payload = jwt.verify(user.otp, process.env.OTP_SECRET)
    if(payload.otp == code){
        const forgotToken = user.createforgotPasswordToken()
        res.status(200).json({
            msg:"code matched",
            token:forgotToken,
        })
    }else{
        res.status(400).json({
            err:"wrong code, try again."
        })
    }
    }catch(err) {
        res.status(400).json({err:err.message})
    }
    
    
}

const updatePassword = async(req, res) => {
    const { email, password } = req.body
    if(password.length < 8){
        res.status(400).json({err:'password must be 8 or more characters'})
    }
    try {
        jwt.verify(req.body.token, process.env.FORGOT_PASSWORD_SECRET)
        const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt) 
    const user = await User.findOneAndUpdate({email}, {password:hashedPassword}).catch((err) => {
        console.log(err.message)
        res.status(400).json({err:err.message})
    })
    if(!user){
        console.log( `there is no user with this email`)
        return res.status(400).json({err: `there is no user with this email`})
    }
    res.status(200).json({
        msg:"password changed successfully"
    })
    } catch (err) {
        res.status(400).json({err:err.message})
    }
    
}
 

// Export controller
module.exports = { register, login, sendEmail, checkCode, updatePassword}