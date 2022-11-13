const SubTask = require('../models/subTask')
const Task = require('../models/task')
const Notification = require('../models/notification')


const createSubTask = async (req, res) => {
    console.log('createSubTask')
    if (!req.body.id) {
        return res.status(400).json({ err: 'input id' })
    }
    Task.findOne({ user: req.user.userId, _id: req.body.id })
        .then(async (task) => {
            if (!task) {
                console.log(`there is no task with this id`)
                return res.status(400).json({ err: `there is no task with this id` })
            }

            await SubTask.create({ task: req.body.id, ...req.body })
                .then((results) => {
                    return res.status(201).json({ msg: "sub Task has been successfully created." })
                })
                .catch((err) => {
                    return res.status(400).json({ err: err.message })
                })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(400).json({ err: err.message })
        })

}

const deleteSubTask = async (req, res) => {
    console.log('deleteSubTask')
    if (!req.body._id) {
        return res.status(400).json({ err: 'input id' })
    }
    await SubTask.findById(req.body._id)
        .then(async (subTask) => {
            if (!subTask) {
                return res.status(400).json({ err: 'there is no subTask with this id' })
            }
            const task = await Task.findOne({ _id: subTask.task, user: req.user.userId })
                .then(async (task) => {
                    if (!task) {
                        return res.status(400).json({ err: 'there is no task with this id' })
                    }
                    await subTask.remove().then((result) => {
                        return res.status(200).json({ msg: `sub Task deleted successfully` })
                    }).catch((error) => {
                        return res.status(400).json({ err: error.message })
                    })
                })
                .catch((error) => {
                    return res.status(400).json({ err: error.message })
                })

        })
        .catch((error) => {
            return res.status(400).json({ err: error.message })
        })


}


const updateSubTaskStatus = async (req, res) => {
    console.log('updateSubTaskStatus')
    if (!req.body._id) {
        return res.status(400).json({ err: 'input id' })
    }
    await SubTask.findById(req.body._id)
        .then(async (subTask) => {
            if (!subTask) {
                console.log(`there is no subTask with this id`)
                return res.status(400).json({ err: `there is no subTask with this id` })
            }
            await Task.findOne({ _id: subTask.task, user: req.user.userId })
                .then(async (task) => {
                    if (!task) {
                        return res.status(400).json({ err: 'there is no task with this id' })
                    }
                    await subTask.updateOne({ status: req.body.status })
                        .then(async result => {
                            // send notification for Overdue status
                            if (req.body.status == 'Overdue') {
                                await Notification.create({ user: req.user.userId, title: subTask.title, status: req.body.status })
                                    .catch((err) => {
                                        console.log("notification error ", err);
                                    })
                            }
                            return res.status(200).json({
                                msg: "status changed successfully"
                            })
                        })
                        .catch((error) => {
                            return res.status(400).json({ err: error.message })
                        })
                })
                .catch((error) => {
                    return res.status(400).json({ err: error.message })
                })

        })
        .catch((err) => {
            console.log(err.message)
            return res.status(400).json({ err: err.message })
        })

}

const editSubTask = async (req, res) => {
    console.log('editSubTask')
    if (!req.body._id) {
        return res.status(400).json({ err: 'input id' })
    }
    await SubTask.findById(req.body._id)
        .then(async (subTask) => {
            if (!subTask) {
                return res.status(400).json({ err: 'there is no subTask with this id' })
            }
            await Task.findOne({ _id: subTask.task, user: req.user.userId })
                .then(async (task) => {
                    if (!task) {
                        return res.status(400).json({ err: 'there is no task with this id' })
                    }
                    return res.status(200).json({ task: subTask })
                })
                .catch((error) => {
                    return res.status(400).json({ err: error.message })
                })


        })
        .catch((error) => {
            return res.status(400).json({ err: error.message })
        })

}

const updateSubTask = async (req, res) => {
    console.log('updateSubTask')
    if (!req.body._id) {
        return res.status(400).json({ err: 'input id' })
    }
    await SubTask.findById(req.body._id)
        .then(async (subTask) => {
            if (!subTask) {
                return res.status(400).json({ err: 'there is no subTask with this id' })
            }
            await Task.findOne({ _id: subTask.task, user: req.user.userId })
                .then(async (task) => {
                    if (!task) {
                        return res.status(400).json({ err: 'there is no task with this id' })
                    }
                    await subTask.updateOne({ ...req.body })
                        .then((result) => {
                            return res.status(200).json({ msg: "sub Task has been successfully updated." })
                        })
                        .catch((err) => {
                            res.status(400).json({ err: err.message })
                        })
                })
                .catch((error) => {
                    return res.status(400).json({ err: error.message })
                })

        })
        .catch((error) => {
            return res.status(400).json({ err: error.message })
        })

}


module.exports = {
    deleteSubTask,
    createSubTask,
    updateSubTaskStatus,
    editSubTask,
    updateSubTask,
}