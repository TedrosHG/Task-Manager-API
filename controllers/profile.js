const User = require('../models/user')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')


const changePassword = async (req, res) => {
    await User.findById(req.user.userId)
    .then((user) => {
        if (!user) {
            return res.status(400).json({ err: 'sorry, something went wrong. try again' })
        }else{
            user.password=req.body.password
            user.save((err)=>{
                if(err){
                    return res.status(400).json({ err: err.message })
                }else{
                    return res.status(200).json({ msg: 'password has been successfully changed' })
                }
            })
            
        }
    })
    .catch((err) => {
        console.log(err.message)
        return res.status(400).json({ err: err.message })
    })
}

const deleteAccount = async (req, res) => {
    await User.findById(req.user.userId)
    .then((user) => {
        if (!user) {
            return res.status(400).json({ err: 'sorry, something went wrong. try again' })
        }else{
            newEmail="dltd."+user.email
            user.updateOne({reason:req.body.reason, email:newEmail, status:false})
            .then((result) => {
                const reset = jwt.sign(
                    { userId: user._id, },
                    process.env.JWT_SECRET,
                    { expiresIn: '30m', }
                )
                
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
                    to: user.email,
                    subject: 'Reset account for todo app',
                    html: ` Your account has been temporarily deleted.<br>
                    Click the link below to reactivate your account<br>
                    This link will expire in 30 minutes and then your account will be permanently deleted.<br>
                    <a href='https://too-doo-task.herokuapp.com/api/toodoo/auth/reset/${reset}'>Reactivate Account</a>
                    
                    <hr>
                    If the link expires or the account deleted permanently<br>
                    You can register again using the link below<br>
                    <a href='https://mytoodoo.netlify.app/register'>Register</a>
                    `
                };

                transporter.sendMail(mailOptions, async function (error, info) {
                    if (error) {
                        console.log(error);
                        return res.status(400).json({ err:error.message })
                    } else {
                        console.log('Email sent: ' + info.response);
                        return res.status(200).json({ msg: 'Account has been successfully deleted' })
                    }
                });

                
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

const getProfile = async (req, res) => {
    await User.findById(req.user.userId)
    .then((user) => {
        if (!user) {
            return res.status(400).json({ err: 'sorry, something went wrong. try again' })
        }else{
            return res.status(200).json({ 
                email:user.email, 
                fullName:user.fullName,
                phoneNumber:user.phoneNumber, 
                gender:user.gender, 
                DoB:user.DoB, 
                img:user.img == "" ? "":`https://too-doo-task.herokuapp.com/profileImage/${user.img}` 
            })
             }
    })
    .catch((err) => {
        console.log(err.message)
        return res.status(400).json({ err: err.message })
    })
}

const updateProfile =  async (req, res) => {
    
    console.log('request image: ',req.file)
    console.log('request body: ',req.body)
    await User.findById(req.user.userId)
    .then((user) => {
        if (!user) {
            return res.status(400).json({ err: 'sorry, something went wrong. try again' })
        }else{
            let image
            if(req.file){
                image = req.file.filename
            }else{
                image = user.img
            }
            user.updateOne({ img:image , ...req.body})
            .then((result) => {
                return res.status(200).json({ msg: 'profile has been successfully updated' })
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

// Export controller
module.exports = {  changePassword, deleteAccount, getProfile, updateProfile }