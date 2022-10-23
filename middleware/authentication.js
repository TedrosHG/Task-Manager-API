const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    // check header
    console.log('token: ',req.headers.authorization)
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(400).json({err: "Authentication Failed, there is no token"})
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // attach user id inorder to be used by other routes
        req.user = { userId: payload.userId}
        next()
    } catch (error) {
        return res.status(401).json({err: "Authentication Failed, invalid token"})
    }
}

module.exports = auth