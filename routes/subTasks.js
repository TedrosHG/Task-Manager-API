const express = require('express')


const { deleteSubTask,
    createSubTask,
    updateSubTaskStatus,
    editSubTask,
    updateSubTask } = require('../controllers/subTasks')

const router = express.Router()

// swagger for schemas
/**
 * @swagger
 * components:
 *  schemas:
 *      subTask:
 *          type: object
 *          required:
 *              - task
 *              - title
 *              - dateTime
 *              - duration
 *              - priority
 *              - reminder
 *              - status
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of the task
 *              task:
 *                  type: string
 *                  description: The reference for the task
 *              title:
 *                  type: string
 *                  description: The task title
 *              note:
 *                  type: string
 *                  description: The task note
 *              dateTime:
 *                  type: string
 *                  format: date
 *                  description: The task starting date time
 *              duration:
 *                  type: string
 *                  enum: ["15 mins", "30 mins", "1 hrs", "2 hrs","6 hrs","12 hrs"] 
 *                  default: "30 mins"
 *                  description: The task duration
 *              priority:
 *                  type: integer
 *                  enum: [1, 2, 3, 4, 5]
 *                  default: 1
 *                  description: The task priority
 *              reminder:
 *                  type: string
 *                  enum: ["15 mins", "30 mins", "1 hrs", "2 hrs"]
 *                  default: "30 mins"
 *                  description: The task reminder
 *              status:
 *                  type: string
 *                  enum: ["In progress", "Overdue", "Canceled", "Done", "Upcoming"]
 *                  default: "Upcoming"
 *                  description: The task status
 *              reminderStatus:
 *                  type: boolean
 *                  default: "false"
 *                  description: The reminder status that tells if reminder is send or not
 * 
 */

/**
 * @swagger
 * tags:
 *  name: SubTasks
 *  description: The subTasks managing API
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
 * /subTasks/create:
 *  post:
 *      summary: Create SubTask
 *      description: creating subTask by providing the below request body input 
 *      security:
 *          -   BearerAuth: []
 *      tags: [SubTasks]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *                          title:
 *                              type: string
 *                          note:
 *                              type: string
 *                          dateTime:
 *                              type: string
 *                              format: date
 *                          duration:
 *                              type: string
 *                              enum: ["15 mins", "30 mins", "1 hrs", "2 hrs","6 hrs","12 hrs"] 
 *                              default: "30 mins"
 *                          priority:
 *                              type: integer
 *                              enum: [1, 2, 3, 4, 5]
 *                              default: 1
 *                          reminder:
 *                              type: string
 *                              enum: ["15 mins", "30 mins", "1 hrs", "2 hrs"]
 *                              default: "30 mins"
 *      responses:
 *          201:
 *              description: The task was created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string                       
 *          401:
 *              description: Authentication failed
 *          400:
 *              description: Something went wrong
 */
router.route('/create').post(createSubTask)

/**
 * @swagger
 * /subTasks/delete:
 *  delete:
 *      summary: delete SubTask 
 *      description: delete the subTask by its subTask id
 *      security:
 *          -   BearerAuth: []
 *      tags: [SubTasks]
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
 *              description: deleted subTask                     
 *          401:
 *              description: Authentication failed
 *          400:
 *              description: Something went wrong
 *          404:
 *              description: The subTask was not found
 */
router.route('/delete').delete(deleteSubTask)

/**
 * @swagger
 * /subTasks/updateStatus:
 *  patch:
 *      summary: Change SubTask Status
 *      description: you change the status of a subTask by its subTask id
 *      security:
 *          -   BearerAuth: []
 *      tags: [SubTasks]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                              enum: ["In progress", "Overdue", "Canceled", "Done", "Upcoming"]
 *                              default: "Upcoming"
 *                          _id:
 *                              type: string
 *      responses:
 *          200:
 *              description: subTask status updated successfully
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
 *          401:
 *              description: Authentication failed
 */
router.route('/updateStatus').patch(updateSubTaskStatus)

/**
 * @swagger
 * /subTasks/edit:
 *  post:
 *      summary: Edit SubTask
 *      description: return the subTask to be edit the subTask by subTask id
 *      security:
 *          -   BearerAuth: []
 *      tags: [SubTasks]
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
 *              description: get subTask to be edited
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/subTask'
 *          400:
 *              description: Something went wrong
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          err:
 *                              type: string                     
 *          401:
 *              description: Authentication failed
 */
router.route('/edit').post(editSubTask)

/**
 * @swagger
 * /subTasks/update:
 *  patch:
 *      summary: Update SubTask
 *      description: update the given subTask by subTask id
 *      security:
 *          -   BearerAuth: []
 *      tags: [SubTasks]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                          title:
 *                              type: string
 *                          note:
 *                              type: string
 *                          dateTime:
 *                              type: string
 *                              format: date
 *                          duration:
 *                              type: string
 *                              enum: ["15 mins", "30 mins", "1 hrs", "2 hrs","6 hrs","12 hrs"] 
 *                              default: "30 mins"
 *                          priority:
 *                              type: integer
 *                              enum: [1, 2, 3, 4, 5]
 *                              default: 1
 *                          reminder:
 *                              type: string
 *                              enum: ["15 mins", "30 mins", "1 hrs", "2 hrs"]
 *                              default: "30 mins"
 *      responses:
 *          200:
 *              description: subTask updated successfully
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
 *          401:
 *              description: Authentication failed
 */
router.route('/update').patch(updateSubTask)

module.exports = router