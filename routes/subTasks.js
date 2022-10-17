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
 *              category:
 *                  type: string
 *                  enum: ["Work", "Family", "Education", "Shopping", "Others"]
 *                  default: "Others"
 *                  description: The task category
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
 *      summary: create sub task
 *      security:
 *          -   BearerAuth: []
 *      tags: [SubTasks]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The Task id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/subTask'
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
router.route('/create/:id').post(createSubTask)

/**
 * @swagger
 * /subTasks/delete/{id}:
 *  delete:
 *      summary: delete the subTask by id
 *      security:
 *          -   BearerAuth: []
 *      tags: [SubTasks]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The subTask id
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
router.route('/delete/:id').delete(deleteSubTask)

/**
 * @swagger
 * /subTasks/updateStatus/{id}:
 *  patch:
 *      summary: change subTask status
 *      security:
 *          -   BearerAuth: []
 *      tags: [SubTasks]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The subTask id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                              enum: ["Canceled", "Done"]
 *                              default: "Done"
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
router.route('/updateStatus/:id').patch(updateSubTaskStatus)

/**
 * @swagger
 * /subTasks/edit/{id}:
 *  get:
 *      summary: edit subTask by id
 *      security:
 *          -   BearerAuth: []
 *      tags: [SubTasks]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The subTask id
 *      responses:
 *          200:
 *              description: get subTask to be edited
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
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
router.route('/edit/:id').get(editSubTask)

/**
 * @swagger
 * /subTasks/update/{id}:
 *  put:
 *      summary: update subTask by id
 *      security:
 *          -   BearerAuth: []
 *      tags: [SubTasks]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The subTask id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/subTask'
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
router.route('/update/:id').put(updateSubTask)

module.exports = router