const Task = require('../models/task')
const SubTask = require('../models/subTask')
const Notification = require('../models/notification')

const getAllTasks = async (req, res) => {
    console.log('getAllTask')
    await Task.find({ user: req.user.userId })
        .then(async (results) => {
            let tasks = [];
            let subtasks = [];
            //check if there is subTask and adding them to their tasks as subTask
            for (let result in results) {
                let task = {};
                //console.log(results[result])
                await SubTask.find({ task: results[result]._id }).then((values) => {
                    //task=results[result]
                    //results[result].subTasks.push(values)
                    //results[result].subTasks=values
                    //results[result].push({"subTasks":values})

                    task._id = results[result]._id
                    task.user = results[result].user
                    task.title = results[result].title
                    task.note = results[result].note
                    task.dateTime = results[result].dateTime
                    task.duration = results[result].duration
                    task.category = results[result].category
                    task.priority = results[result].priority
                    task.reminder = results[result].reminder
                    task.status = results[result].status
                    task.subTask = values

                    subtasks.push(values)
                }).catch((errors) => {
                    return res.status(400).json({ errs: errors.message })
                })
                tasks.push(task)

            }
            return res.status(200).json({ tasks })
        })
        .catch((err) => {
            return res.status(400).json({ err: err.message })
        })

}
const getTask = async (req, res) => {
    console.log('getSingleTask')
    if (!req.body._id) {
        return res.status(400).json({ err: 'input id' })
    }
    await Task.findOne({ user: req.user.userId, _id: req.body._id })
        .then(async (results) => {
            if (!results) {
                return res.status(404).json({ err: "there is no task with this id" })
            }

            //check if there is subTask and adding them to their tasks as subTask
            let task = {};

            await SubTask.find({ task: results._id }).then((values) => {
                //console.log(Task.schema.path('duration').enumValues);
                return res.status(200).json({ task: results, subTasks: values })

            }).catch((errors) => {
                return res.status(400).json({ err: errors.message })
            })
        })
        .catch((err) => {
            return res.status(400).json({ err:err.message })
        })
}
const createTask = async (req, res) => {
    console.log('createTask', req.body)

    await Task.create({ user: req.user.userId, ...req.body.task })
        .then(async (results) => {
            if (req.body.subTask != '') {
                subTasks = []
                req.body.subTask.forEach(async subtask => {
                    subTask = {}
                    subTask.task = results._id
                    subTask.title = subtask.title
                    subTask.note = subtask.note
                    subTask.dateTime = subtask.dateTime
                    subTask.duration = subtask.duration
                    subTask.priority = subtask.priority
                    subTask.reminder = subtask.reminder

                    subTasks.push(subTask)
                })
                try {
                    await SubTask.insertMany(subTasks)
                    return res.status(201).json({ msg: "Task and sub task has been successfully created." })
                } catch (error) {
                    //await Task.findByIdAndDelete(results._id)
                    await results.remove()
                    return res.status(400).json({ err: error.message })
                }



            } else {
                return res.status(201).json({ msg: "Task has been successfully created.", results })
            }
        })
        .catch((err) => {
            return res.status(400).json({ err: err.message })
        })

}
const updateTaskStatus = async (req, res) => {
    console.log('updateTaskStatus', req.body)
    const { status, _id } = req.body
    if (!status || !_id) {
        return res.status(400).json({ err: 'input both status and _id' })
    }
    await Task.findOne({ user: req.user.userId, _id })
        .then(async (task) => {
            if (!task) {
                console.log(`there is no task with this id`)
                return res.status(404).json({ err: `there is no task with this id` })
            } else {

                //find subTask and update status if only if the status is canceled
                if (status == "Canceled") {
                    console.log(task._id)
                    await SubTask.find({ task: task._id })
                        .then((subTasks) => {
                            if (subTasks) {
                                subTasks.forEach(async subTask => {
                                    if (subTask.status == "In progress" || subTask.status == "Upcoming") {
                                        await subTask.updateOne({ status }).catch((err) => {
                                            console.log("2", err.message)
                                            return res.status(400).json({ err: err.message })
                                        })
                                    }
                                })
                            }
                        })
                        .catch((err) => {
                            console.log("3", err.message)
                            return res.status(400).json({ err: err.message })
                        })

                }
                //update task status
                await task.updateOne({ status })
                    .then(async result => {
                        // send notification for Overdue status
                        if (status == 'Overdue') {
                            await Notification.create({ user: req.user.userId, title: task.title, status })
                                .catch((err) => {
                                    console.log("notification error ", err);
                                })
                        }
                        return res.status(200).json({
                            msg: "status changed successfully"
                        })
                    })
                    .catch((err) => {
                        console.log("4", err.message)
                        return res.status(400).json({ err: err.message })
                    })


            }
        })
        .catch((err) => {
            console.log("1", err.message)
            return res.status(400).json({ err: err.message })
        })


}
const deleteTask = async (req, res) => {
    console.log('deleteTask', req.body)
    if (!req.body._id) {
        return res.status(400).json({ err: 'input id' })
    }
    let msg = ''
    await Task.findOne({ user: req.user.userId, _id: req.body._id })
        .then(async (task) => {
            if (!task) {
                console.log(`there is no task with this id`)
                return res.status(404).json({ err: `there is no task with this id` })
            } else {
                const results = await SubTask.deleteMany({ task: task._id })
                    .catch((err) => {
                        console.log(err.message)
                        return res.status(400).json({ err: err.message })
                    })
                if (results.deletedCount > 0) {
                    msg = ' and sub task'
                }
                console.log('there is task')
                await task.remove().then((result) => {
                    return res.status(200).json({ msg: `task${msg} deleted successfully` })
                }).catch((error) => {
                    return res.status(500).json({ err: error.message })
                })
            }
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(400).json({ err: err.message })
        })


}

const editTask = async (req, res) => {
    console.log('editTask')
    if (!req.body._id) {
        return res.status(400).json({ err: 'input id' })
    }
    await Task.findOne({ user: req.user.userId, _id: req.body._id })
        .then(async (result) => {
            if (!result) {
                return res.status(400).json({ err: "there is no task with this id" })
            }
            return res.status(200).json({ task: result })
        })
        .catch((err) => {
            return res.status(400).json({ err })
        })
}

const updateTask = async (req, res) => {
    console.log('updateTask')
    // check for input
    if (!req.body._id) {
        return res.status(400).json({ err: 'input id' })
    }
    //find task
    const task = await Task.findOne({ user: req.user.userId, _id: req.body._id })
        .then(async (task) => {
            if (!task) {
                console.log(`there is no task with this id`)
                return res.status(404).json({ err: `there is no task with this id` })
            }

            // update task
            await task.updateOne({ ...req.body })
                .then(async (result) => {
                    return res.status(200).json({
                        msg: "Task has been successfully updated."
                    })
                })
                .catch((err) => {
                    console.log(err.message)
                    return res.status(400).json({ err: err.message })
                })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(400).json({ err: err.message })
        })



}


module.exports = {
    createTask,
    deleteTask,
    getAllTasks,
    updateTaskStatus,
    getTask,
    editTask,
    updateTask
} 