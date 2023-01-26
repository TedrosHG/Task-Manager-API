const jwt = require('jsonwebtoken')

const User = require('../models/user')

const auth = async (req, res, next) => {
    // check header
    //console.log('token: ',req.body ,req.headers.authorization)
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(400).json({err: "Authentication Failed, there is no token"})
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        await User.findById(payload.userId)
        .then((result) => {
            if(result.email.startsWith('dltd.')){
                //return res.status(401).json({err: "Authentication Failed, No account"})
                return res.redirect(process.env.URL_Front_End);
            }else{
                // attach user id inorder to be used by other routes
                req.user = { userId: payload.userId}
                next()
            }
        })
        .catch((err) => {
            return res.status(401).json({err: err.message})
        })
        
        
    } catch (error) {
        return res.status(401).json({err: "Authentication Failed, invalid token"})
    }
}

module.exports = auth