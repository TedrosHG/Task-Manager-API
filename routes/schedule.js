const express = require('express')

const { reminderSchedule} = require('../controllers/schedule')

const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Reminder
 *  description: the push reminder notification
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
 * /subscribe:
 *  post:
 *      summary: Push Reminder Notification
 *      description: send push reminder notification every one minute after user sends subscribe route
 *      security:
 *          -   BearerAuth: []
 *      tags: [Reminder]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          body:
 *                              type: string  
 *      responses:
 *          200:
 *              description: The task was created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              title:
 *                                  type: string
 *                              body:
 *                                  type: string                        
 *          401:
 *              description: Authentication failed
 *          400:
 *              description: Something went wrong
 */
 router.route('/').post(reminderSchedule)

module.exports = router