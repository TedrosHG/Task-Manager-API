const express = require('express')

const { register, login, sendEmail, checkCode, updatePassword} = require('../controllers/users')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgetPassword', sendEmail)
router.post('/verifyCode/', checkCode)
router.patch('/newPassword/', updatePassword)


module.exports = router
