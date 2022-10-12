const Task = require('../models/task')
const SubTask = require('../models/subTask')


const getAllTasks = async (req, res) => {

    await Task.find({ user: req.user.userId })
        .then(async (results) => {
            if (!results) {
                return res.status(400).json({ err: "there is no task" })
            }
            let tasks = [];
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


                }).catch((errors) => {
                    return res.status(400).json({ err: errors })
                })
                tasks.push(task)
            }
            res.json({ tasks })
        })
        .catch((err) => {
            res.status(400).json({ err })
        })

}
const getTask = async (req, res) => {
    //console.log(req.params.id)
    await Task.findOne({ user: req.user.userId, _id: req.params.id })
        .then(async (results) => {
            if (!results) {
                return res.status(400).json({ err: "there is no task with this id" })
            }

            //check if there is subTask and adding them to their tasks as subTask
            let task = {};
            
            await SubTask.find({ task: results._id }).then((values) => {
                //task=results[result]
                //results[result].subTasks.push(values)
                //results[result].subTasks=values
                //results[result].push({"subTasks":values})

                task._id = results._id
                task.user = results.user
                task.title = results.title
                task.note = results.note
                task.dateTime = results.dateTime
                task.duration = results.duration
                task.category = results.category
                task.priority = results.priority
                task.reminder = results.reminder
                task.status = results.status
                task.subTask = values


            }).catch((errors) => {
                return res.status(400).json({ err: errors })
            })


            res.json({ task })
        })
        .catch((err) => {
            res.status(400).json({ err })
        })
}
const createTask = async (req, res) => {

    await Task.create({ user: req.user.userId, ...req.body })
        .then((results) => {
            res.status(201).json({ message: "Task has been successfully created." })
        })
        .catch((err) => {
            res.status(400).json({ err: err.errors })
        })

}
const updateTaskStatus = async (req, res) => {
    const { status } = req.body

    const task = await Task.findByIdAndUpdate(req.params.id, { status }).catch((err) => {
        console.log(err.message)
        res.status(400).json({ err: err.message })
    })
    if (!task) {
        console.log(`there is no task with this id`)
        return res.status(400).json({ err: `there is no task with this id` })
    }
    res.json({
        message: "status changed successfully"
    })


}
const deleteTask = async (req, res) => {
    let msg = ''
    const task = await Task.findById(req.params.id).catch((err) => {
        console.log(err.message)
        res.status(400).json({ err: err.message })
    })
    if (!task) {
        console.log(`there is no task with this id`)
        return res.status(400).json({ err: `there is no task with this id` })
    }
    const results = await SubTask.deleteMany({ task: task._id })
        .catch((err) => {
            console.log(err.message)
            res.status(400).json({ err: err.message })
        })
    if (results.deletedCount>0) {
        msg = ' and sub task'
    }
    console.log('there is task')
    await task.remove().then((result) => {
        res.json({ message: `task${msg} deleted successfully` })
    }).catch((error) => {
        res.status(500).json({ err: error.message })
    })
}

const editTask = async (req, res) => {
    await Task.findOne({ user: req.user.userId, _id: req.params.id })
        .then(async (result) => {
            if (!result) {
                return res.status(400).json({ err: "there is no task with this id" })
            }
            res.json({ task: result })
        })
        .catch((err) => {
            res.status(400).json({ err })
        })
}

const updateTask = async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id,{ user: req.user.userId, ...req.body })
        .then((results) => {
            res.status(201).json({ message: "Task has been successfully updated." })
        })
        .catch((err) => {
            res.status(400).json({ err: err.errors })
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