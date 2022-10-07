const User = require('../models/user')

const register = async (req, res) => {
    // create user    
    await User.create({ ...req.body})
    .then((result) => {
        // create JWT token
        const token = result.createJWT()
        // send the result to front end
        res.status(201).json({ email:result.email, Token:token })
    })
    .catch((err) => {
        if(err.code === 11000){ // check for deplicated key (email)
            // console.log("This email is already taken")
            res.status(400).json({err:"This email is already taken"})
        }else{
            // console.log(err.message)
            res.status(400).json({err:err.message}) 
        }
        
    })
    
}


const login = async (req, res) => {
    const { email, password } = req.body

    // check require email and password
    if(!email || !password){
        console.log( `please provide all input`)
        return res.status(400).json({err: "please provide all input"})
    }

    // check user with this email
    const user = await User.findOne({email}).catch((err) => {
        // console.log(err.message)
        res.json({err:err.message})
    })
    if(!user){
        // console.log( `Invalid Credentials(email)`)
        return res.status(400).json({err: `Invalid Credentials`})
    }
    // check password
    const checkPassword = await user.comparePassword(password)
    .catch((err) => {
        console.log(err.message)
    })
    if(!checkPassword){
        // console.log( `Invalid Credentials(password)`)
        return res.status(400).json({err: `Invalid Credentials`})
    }

    // create token
    const token = user.createJWT()
    // send result to front end
    res.status(201).json({ email:user.email, Token:token })


}   

// Export controller
module.exports = { register, login}