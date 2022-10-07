const User = require('../models/user')

const register = async (req, res) => {
    const {email, password} = req.body

    // check require email and password
    if(!email || !password){
        return res.status(400).json({err: "please provide all input"})
    }
    // check password length is greater or equal to 8
    if(password.length<8){
        return res.status(400).json({err: "password must greater or equal to 8 character"})
    }

    // check user with this email
    const user = await User.findOne({email:req.body.email}).catch((err) => {
        res.json({err})
    })
    if(user){
        console.log("This email is already taken")
        return res.status(400).json({err: "This email is already taken"})
    }

    await User.create({ ...req.body})
    .then((result) => {
        const token = result.createJWT()
        // res.status(201).json({ user: { userId:result._id}, token })
        res.status(201).json({ email:result.email, Token:token })
    })
    .catch((err) => {
        console.log(json({err}))
    })
    
}


const login = async (req, res) => {
    const { email, password } = req.body
    console.log(`email:${email}, password:${password}`)

    // check require email and password
    if(!email || !password){
        console.log( `please provide all input`)
        return res.status(400).json({err: "please provide all input"})
    }

    // check user with this email
    const user = await User.findOne({email}).catch((err) => {
        console.log(json({err}))
    })
    if(!user){
        console.log( `Invalid Credentials(email)`)
        //return res.status(401).json({err: `There is no user with this email ${email}`})
        return res.status(400).json({err: `Invalid Credentials`})
    }
    // check password
    const checkPassword = await user.comparePassword(password)
    .catch((err) => {
        console.log(json({err}))
    })
    if(!checkPassword){
        console.log( `Invalid Credentials(password)`)
        return res.status(400).json({err: `Invalid Credentials`})
    }

    // create token
    const token = user.createJWT()
    // res.status(201).json({ user: { userId:user._id}, token })
    res.status(201).json({ email:user.email, Token:token })


}   

// Export controller
module.exports = { register, login}