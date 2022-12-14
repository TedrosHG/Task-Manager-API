const express = require('express')

const { register, login, sendEmail, checkCode, newPassword, reset} = require('../controllers/users')


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
 *              fullName:
 *                  type: string
 *                  description: The full name of the user
 *              phoneNumber:
 *                  type: string
 *                  description: The forget password otp
 *              gender:
 *                  type: string
 *                  description: The gender of the user
 *              DoB:
 *                  type: string
 *                  format: date
 *                  description: The date of birth
 *              img:
 *                  type: string
 *                  description: The profile image
 *              status:
 *                  type: boolean
 *                  description: The status of the account active or inactive
 *              reason:
 *                  type: string
 *                  description: The reason for deleting the account
 * 
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
 *      summary: Register User
 *      description: user can register by providing the below input
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
 *                          properties:
 *                              email:
 *                                  type: string
 *                              Token:
 *                                  type: string
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              err:
 *                                  type: string
 */
router.post('/register', register)

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Login User
 *      description: user can sign in by providing the below input
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
 *                          properties:
 *                              email:
 *                                  type: string
 *                              Token:
 *                                  type: string
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              err:
 *                                  type: string
 */
router.post('/login', login)

/**
 * @swagger
 * /auth/forgetPassword:
 *  post:
 *      summary: Forget Password
 *      description: user can reset its password by providing the below input
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
 *                          properties:
 *                              msg:
 *                                  type: string
 *                              email:
 *                                  type: string
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              err:
 *                                  type: string
 */
router.post('/forgetPassword', sendEmail)

/**
 * @swagger
 * /auth/verifyCode:
 *  post:
 *      summary: Verify Code
 *      description: verify code that have been send to email
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
 *                              type: string
 *                              minLength: 4
 *                              maxLength: 4
 *      responses:
 *          200:
 *              description: code matched successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                              Token:
 *                                  type: string
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              err:
 *                                  type: string
 */
router.post('/verifyCode/', checkCode)

/**
 * @swagger
 * /auth/newPassword:
 *  patch:
 *      summary: Update Password
 *      description: update user password by providing new password after verifying the code that have been send to email.
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
 *                          email:
 *                              type: string
 *                              format: email
 *      responses:
 *          200:
 *              description: password has been changed successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              err:
 *                                  type: string
 */
router.patch('/newPassword', newPassword)

/**
 * @swagger
 * /auth/verifyCode:
 *  post:
 *      summary: Verify Code
 *      description: verify code that have been send to email
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
 *                              type: string
 *                              minLength: 4
 *                              maxLength: 4
 *      responses:
 *          200:
 *              description: code matched successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                              Token:
 *                                  type: string
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              err:
 *                                  type: string
 */
 router.post('/verifyCode/', checkCode)

 /**
  * @swagger
  * /auth/reset/{id}:
  *  get:
  *      summary: Reset Account
  *      description: after the account have been deleted, in the period of 30 minutes you can reset or recover the account
  *      tags: [Users]
  *      parameters:
  *         -   name: id
  *             in: path
  *             escription: reset token
  *             required: true
  *             schema:
  *                 type: string
  *      responses:
  *          200:
  *              description: account has been reactivated, and send successful email and redirects to login page
  *          400:
  *              description: account deleted permanently, redirects to register page 
  */
router.get('/reset/:id', reset)



module.exports = router
