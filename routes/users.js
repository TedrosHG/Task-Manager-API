const express = require('express')

const { register, login, sendEmail, checkCode, updatePassword} = require('../controllers/users')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/sendEmail', sendEmail)
router.post('/checkCode/:id', checkCode)
router.patch('/updatePassword/:id', updatePassword)


module.exports = router
