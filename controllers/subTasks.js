const SubTask = require('../models/subTask')
const Task = require('../models/task')


const createSubTask = async (req, res) => {
    const task = await Task.findById(req.body.taskId).catch((err) => {
        console.log(err.message)
        res.status(400).json({err:err.message})
    })
    if(!task){
        console.log( `there is no task with this id`)
        return res.status(400).json({err: `there is no task with this id`})
    }

    await SubTask.create({ task: req.body.taskId, ...req.body })
        .then((results) => {
            res.status(201).json({ message: "sub Task has been successfully created." })
        })
        .catch((err) => {
            res.status(400).json({ err: err.errors })
        })
}

const deleteSubTask = async (req, res) => {

    await SubTask.findByIdAndDelete(req.params.id).then((result) => {
        res.json({message:`sub Task deleted successfully`})
    }).catch((error) => {
        res.status(400).json({err:error.message})
    })
}


const updateSubTaskStatus = async (req, res) => {
    const task = await Task.findById(req.body.taskId).catch((err) => {
        console.log(err.message)
        res.status(400).json({err:err.message})
    })
    if(!task){
        console.log( `there is no task with this id`)
        return res.status(400).json({err: `there is no task with this id`})
    }

    const subTask = await SubTask.findByIdAndUpdate(req.params.id, { status:req.body.status }).catch((err) => {
        console.log(err.message)
        res.status(400).json({ err: err.message })
    })
    if (!subTask) {
        console.log(`there is no subTask with this id`)
        return res.status(400).json({ err: `there is no subTask with this id` })
    }
    res.json({
        message: "status changed successfully"
    })
}

const editSubTask = async (req, res) => {
    await SubTask.findOne({ user: req.body.taskId, _id: req.params.id })
        .then(async (result) => {
            if (!result) {
                return res.status(400).json({ err: "there is no sub task with this id" })
            }
            res.json({ task: result })
        })
        .catch((err) => {
            res.status(400).json({ err })
        })
}

const updateSubTask = async (req, res) => {
    const task = await Task.findById(req.body.taskId).catch((err) => {
        console.log(err.message)
        res.status(400).json({err:err.message})
    })
    if(!task){
        console.log( `there is no task with this id`)
        return res.status(400).json({err: `there is no task with this id`})
    }

    await SubTask.findByIdAndUpdate(req.params.id,{ task: req.body.taskId, ...req.body })
        .then((results) => {
            res.status(201).json({ message: "sub Task has been successfully updated." })
        })
        .catch((err) => {
            res.status(400).json({ err: err.errors })
        })
}


module.exports = {
    deleteSubTask,
    createSubTask,
    updateSubTaskStatus,
    editSubTask,
    updateSubTask,
}