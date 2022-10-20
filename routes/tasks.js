const express = require('express')

const { 
    createTask,
    deleteTask,
    getAllTasks,
    updateTaskStatus,
    getTask,
editTask,
updateTask } = require('../controllers/tasks')

const router = express.Router()

// swagger for schemas
/**
 * @swagger
 * components:
 *  schemas:
 *      task:
 *          type: object
 *          required:
 *              - user
 *              - title
 *              - dateTime
 *              - duration
 *              - category
 *              - priority
 *              - reminder
 *              - status
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the task
 *              user:
 *                  type: string
 *                  description: The reference for the user
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
 *              reminderStatus:
 *                  type: boolean
 *                  default: "false"
 *                  description: The reminder status that tells if reminder is send or not
 * 
 */

/**
 * @swagger
 * tags:
 *  name: Tasks
 *  description: The tasks managing API
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
 * /tasks:
 *  get:
 *      summary: Returns the list of all the tasks and subTasks
 *      description: Returns the list of all the tasks and subTasks
 *      security:
 *          -   BearerAuth: []
 *      tags: [Tasks]
 *      responses:
 *          200:
 *              description: The list of all the tasks and sunTasks
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              tasks:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          _id:
 *                                              type: string
 *                                          user:
 *                                              type: string
 *                                          title:
 *                                              type: string
 *                                          note:
 *                                              type: string
 *                                          dateTime:
 *                                              type: string
 *                                          duration:
 *                                              type: string
 *                                          category:
 *                                              type: string
 *                                          priority:
 *                                              type: integer
 *                                          reminder:
 *                                              type: string
 *                                          status:
 *                                              type: string
 *                                          subTask:
 *                                              type: array
 *                                              items:
 *                                                  $ref: '#/components/schemas/subTask'
 *          401:
 *              description: Authentication failed
 *          400:
 *              description: Something went wrong
 */
router.route('/').get(getAllTasks) 

/**
 * @swagger
 * /tasks/create:
 *  post:
 *      summary: create task
 *      description: create task
 *      security:
 *          -   BearerAuth: []
 *      tags: [Tasks]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/task'
 *      responses:
 *          200:
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
router.route('/create').post(createTask)

/**
 * @swagger
 * /tasks/{id}:
 *  get:
 *      summary: Returns the tasks and subTasks by id
 *      description: Get single task by id
 *      security:
 *          -   BearerAuth: []
 *      tags: [Tasks]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The task id
 *      responses:
 *          200:
 *              description: The task description by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              task:
 *                                  $ref: '#/components/schemas/task'    
 *                              subTasks:
 *                                  type: array
 *                                  items: 
 *                                      $ref: '#/components/schemas/subTask'                  
 *          401:
 *              description: Authentication failed
 *          400:
 *              description: Something went wrong
 *          404:
 *              description: The task was not found
 */
router.route('/:id').get(getTask)

/**
 * @swagger
 * /tasks/delete/{id}:
 *  delete:
 *      summary: delete the task by id
 *      description: delete the task by id
 *      security:
 *          -   BearerAuth: []
 *      tags: [Tasks]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The task id
 *      responses:
 *          200:
 *              description: deleted task                     
 *          401:
 *              description: Authentication failed
 *          400:
 *              description: Something went wrong
 *          404:
 *              description: The task was not found
 *          500:
 *              description: internal server error
 */
router.route('/delete/:id').delete(deleteTask)

/**
 * @swagger
 * /tasks/updateStatus/{id}:
 *  patch:
 *      summary: change task status
 *      description: change task status
 *      security:
 *          -   BearerAuth: []
 *      tags: [Tasks]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The task id
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
 *      responses:
 *          200:
 *              description: task status updated successfully
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
router.route('/updateStatus/:id').patch(updateTaskStatus)

/**
 * @swagger
 * /tasks/edit/{id}:
 *  get:
 *      summary: edit task by id
 *      description: edit task by id
 *      security:
 *          -   BearerAuth: []
 *      tags: [Tasks]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The task id
 *      responses:
 *          200:
 *              description: get task to be edited successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/task'
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
router.route('/edit/:id').get(editTask)

/**
 * @swagger
 * /tasks/update/{id}:
 *  put:
 *      summary: update task by id
 *      description: update task by id
 *      security:
 *          -   BearerAuth: []
 *      tags: [Tasks]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The task id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/task'
 *      responses:
 *          200:
 *              description: task updated successfully
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
router.route('/update/:id').put(updateTask)


module.exports = router