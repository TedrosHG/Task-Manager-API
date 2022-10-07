const jwt = require('jsonwebtoken')

const User = require('../models/user')

const auth = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({err: `Authentication invalid`})
    }
    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // attach user id inorder to be used by other routes
        req.user = { userId: payload.userId}
        next()
    } catch (error) {
        return res.status(401).json({err: `Authentication invalid`})
    }
}

module.exports = auth