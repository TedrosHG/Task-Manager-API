const express = require('express')


const { deleteSubTask,
    createSubTask,
    updateSubTaskStatus,
    editSubTask,
    updateSubTask } = require('../controllers/subTasks')

const router = express.Router()


router.route('/create').post(createSubTask)
router.route('/delete/:id').delete(deleteSubTask)
router.route('/updateStatus/:id').patch(updateSubTaskStatus)
router.route('/edit/:id').get(editSubTask)
router.route('/update/:id').put(updateSubTask)

module.exports = router