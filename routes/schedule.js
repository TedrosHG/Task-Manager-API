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
 *      summary: push reminder notification
 *      description: push reminder notification
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
 *                          headers:
 *                              type: object    
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