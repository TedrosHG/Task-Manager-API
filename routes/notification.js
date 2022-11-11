const express = require('express')

const { notify, deleteNotification} = require('../controllers/notification')

const router = express.Router()

// swagger for schemas
/**
 * @swagger
 * components:
 *  schemas:
 *      notification:
 *          type: object
 *          required:
 *              - user
 *              - title
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of the notification
 *              user:
 *                  type: string
 *                  description: The user id
 *              title:
 *                  type: string
 *                  description: The title of the task to be notified
 *              status:
 *                  type: string
 *                  enum: ["Overdue","Upcoming"]
 *                  default: "Upcoming"
 *                  description: The task status
 * 
 * 
 */

/**
 * @swagger
 * tags:
 *  name: notifications
 *  description: The notifications managing API
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
 * /notification:
 *  get:
 *      summary: Get notification
 *      description: Returns the list of all the notifications
 *      security:
 *          -   BearerAuth: []
 *      tags: [notifications]
 *      responses:
 *          200:
 *              description: The list of all the notification
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/notification'
 *          401:
 *              description: Authentication failed
 *          400:
 *              description: Something went wrong
 */
router.route('/').get(notify)

/**
 * @swagger
 * /notification/delete:
 *  delete:
 *      summary: Delete Notification
 *      description: delete the notification that has been seen
 *      security:
 *          -   BearerAuth: []
 *      tags: [notifications]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *      responses:
 *          200:
 *              description: deleted task                     
 *          401:
 *              description: Authentication failed
 *          400:
 *              description: Something went wrong
 */
router.route('/delete').delete(deleteNotification)

module.exports = router