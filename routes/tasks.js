const express = require('express')

const { 
    createTask,
    deleteTask,
    getAllTasks,
    updateTaskStatus,
    getTask, } = require('../controllers/tasks')

const router = express.Router()

router.route('/').post(createTask).get(getAllTasks)

router.route('/:id').get(getTask).delete(deleteTask).patch(updateTaskStatus)

module.exports = router