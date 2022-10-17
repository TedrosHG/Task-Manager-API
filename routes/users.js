const express = require('express')

const { register, login, sendEmail, checkCode, updatePassword} = require('../controllers/users')


const router = express.Router()

// swagger for schemas
/**
 * @swagger
 * components:
 *  schemas:
 *      user:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of the user
 *              email:
 *                  type: string
 *                  format: email
 *                  description: The user email
 *              password:
 *                  type: string
 *                  minLength: 8
 *                  description: The user password
 *              otp:
 *                  type: string
 *                  description: The forget password otp
 * 
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The users managing API
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *      summary: register user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                          password:
 *                              type: string
 *                              minLength: 8
 *      responses:
 *          201:
 *              description: user registered successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          Token:
 *                              type: string
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          err:
 *                              type: string
 */
router.post('/register', register)

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: login user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                          password:
 *                              type: string
 *                              minLength: 8
 *      responses:
 *          200:
 *              description: user login successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          Token:
 *                              type: string
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          err:
 *                              type: string
 */
router.post('/login', login)

/**
 * @swagger
 * /auth/forgetPassword:
 *  post:
 *      summary: forget password
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *      responses:
 *          200:
 *              description: Email send successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          msg:
 *                              type: string
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          err:
 *                              type: string
 */
router.post('/forgetPassword', sendEmail)

/**
 * @swagger
 * /auth/verifyCode:
 *  post:
 *      summary: verify code that have been send to email
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                          code:
 *                              type: integer
 *                              length: 4
 *      responses:
 *          200:
 *              description: Email send successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          msg:
 *                              type: string
 *                          Token:
 *                              type: string
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          err:
 *                              type: string
 */
router.post('/verifyCode/', checkCode)

/**
 * @swagger
 * /auth/newPassword:
 *  patch:
 *      summary: change new password
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          password:
 *                              type: string
 *                              minLength: 8
 *                          token:
 *                              type: integer
 *      responses:
 *          200:
 *              description: Email send successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          msg:
 *                              type: string
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          err:
 *                              type: string
 */
router.patch('/newPassword/', updatePassword)




module.exports = router
