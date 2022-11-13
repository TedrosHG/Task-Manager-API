const User = require('../models/user')


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
                return res.status(200).json({ msg: 'Account has been successfully deleted' })
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
    
    console.log(req.file)
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