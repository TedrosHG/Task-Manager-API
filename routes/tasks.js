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

router.route('/').get(getAllTasks) 
router.route('/create').post(createTask)
router.route('/detail/:id').get(getTask)
router.route('/delete/:id').delete(deleteTask)
router.route('/updateStatus/:id').patch(updateTaskStatus)
router.route('/edit/:id').get(editTask)
router.route('/update/:id').put(updateTask)


module.exports = router