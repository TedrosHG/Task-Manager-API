const Task = require('../models/task')
const SubTask = require('../models/subTask')

const getAllTasks = async (req, res) => {
    //console.log(req.user.userId)
    await Task.find({ user: req.user.userId })
        .then((results) => {
            res.json({ tasks: results })
        })
        .catch((err) => {
            res.json({ err })
        })

}
const getTask = async (req, res) => {
    console.log(req.params.id)
    await Task.findOne({ user: req.user.userId, _id: req.params.id })
        .then((results) => {
            if (!results) {
                return res.json({ err: "there is no task with this id" })
            }
            res.json({ tasks: results })
        })
        .catch((err) => {
            res.json({ err })
        })
}
const createTask = async (req, res) => {

    await Task.create({ user: req.user.userId, ...req.body })
        .then((results) => {
            res.status(201).json({ message: "Task has been successfully created." })
        })
        .catch((err) => {
            res.json({ err: err.errors })
        })

}
const updateTaskStatus = async (req, res) => {
   
    res.json('update tasks')

}
const deleteTask = async (req, res) => {
    res.json('delete task')
}

module.exports = {
    createTask,
    deleteTask,
    getAllTasks,
    updateTaskStatus,
    getTask,
}