const express = require('express')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: './uploads/profile/', 
    filename: (req,file, cb)=>{
        return cb(null, Date.now()+ '_' + file.originalname)
    }
})
const upload = multer({
    storage:storage,
    limits: { fileSize: 1024*1024*5 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      }
})
 
const { changePassword, deleteAccount, getProfile, updateProfile} = require('../controllers/profile')


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
 *                  description: The phone number of the user
 *              gender:
 *                  type: string
 *                  description: The gender of the user
 *              DoB:
 *                  type: string
 *                  format: date
 *                  description: The date of birth
 *              img:
 *                  type: string
 *                  description: The name of the profile image
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
 *  name: profiles
 *  description: manage user account or profile
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      BearerAuth:
 *          type: http
 *          scheme: bearer
 */

/**
 * @swagger
 * /profile/changePassword:
 *  patch:
 *      summary: Update Password
 *      description: update user password by providing new password in thier profile
 *      tags: [profiles] 
 *      security:
 *          -   BearerAuth: []
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
 *      responses:
 *          200:
 *              description: password has been updated successfully
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
router.patch('/changePassword', changePassword)

/**
 * @swagger
 * /profile/delete:
 *  delete:
 *      summary: Delete Account
 *      description: delete user's account if the user donot need it any more
 *      tags: [profiles] 
 *      security:
 *          -   BearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          reason:
 *                              type: string
 *      responses:
 *          200:
 *              description: account has been deleted successfully
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
 router.delete('/delete', deleteAccount)

 /**
 * @swagger
 * /profile:
 *  get:
 *      summary: Get Profile
 *      description: Return the profile info to be edited
 *      tags: [profiles] 
 *      security:
 *          -   BearerAuth: []
 *      responses:
 *          200:
 *              description: return profile
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                              fullName:
 *                                  type: string
 *                              phoneNumber:
 *                                  type: string
 *                              gender:
 *                                  type: string
 *                              DoB:
 *                                  type: string
 *                              img:
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
router.get('/', getProfile)

/**
 * @swagger
 * /profile/update:
 *  patch:
 *      summary: Update Profile
 *      description: update the information for the user in profile
 *      tags: [profiles] 
 *      security:
 *          -   BearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          fullName:
 *                              type: string
 *                          phoneNumber:
 *                              type: string
 *                          gender:
 *                              type: string
 *                          DoB:
 *                              type: string
 *                          img:
 *                              type: string
 *      responses:
 *          200:
 *              description: profile has been updated successfully
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
 router.patch('/update', upload.single('img'), updateProfile)



module.exports = router
