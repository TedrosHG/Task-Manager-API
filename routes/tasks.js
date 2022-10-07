const express = require('express')

const { 
    createTask,
    deleteTask,
    getAllTasks,
    updateTask,
    getTask, } = require('../controllers/tasks')

const router = express.Router()

router.route('/').post(createTask).get(getAllTasks)

router.route('/:id').get(getTask).delete(deleteTask).patch(updateTask)

module.exports = router