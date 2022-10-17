const Task = require('../models/task')
const SubTask = require('../models/subTask')

const getAllTasks = async (req, res) => {
    //console.log(req.user.userId)
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
                    return res.status(400).json({ errs: errors })
                })
                tasks.push(task)
                
            }
            res.status(200).json({ tasks })
        })
        .catch((err) => {
            res.status(400).json({ errss:err })
        })

}
const getTask = async (req, res) => {
    //console.log(req.params.id)
    await Task.findOne({ user: req.user.userId, _id: req.params.id })
        .then(async (results) => {
            if (!results) {
                return res.status(404).json({ err: "there is no task with this id" })
            }

            //check if there is subTask and adding them to their tasks as subTask
            let task = {};
            
            await SubTask.find({ task: results._id }).then((values) => {
            
                res.status(200).json({ task: results, subTasks:values })

            }).catch((errors) => {
                return res.status(400).json({ err: errors })
            })
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
    if(status != 'Done' && status != 'Canceled'){
        return res.status(404).json({ err: `Only status Done or Canceled can be selected` })
    }
    const task = await Task.findOne({ user: req.user.userId, _id: req.params.id }, { status }).catch((err) => {
        console.log(err.message)
        res.status(400).json({ err: err.message })
    })
    if (!task) {
        console.log(`there is no task with this id`)
        return res.status(404).json({ err: `there is no task with this id` })
    }

    // check input status
    if(task.status != "In progress"){
        return res.status(404).json({ err: "you only can change status in 'In progress' status" })
    }
    //update status
    await task.updateOne(req.params.id, { $set: { status } }).catch((err) => {
        console.log(err.message)
        res.status(400).json({ err: err.message })
    })
    
    res.status(200).json({
        msg: "status changed successfully"
    })


}
const deleteTask = async (req, res) => {
    let msg = ''
    const task = await Task.findOne({ user: req.user.userId, _id: req.params.id }).catch((err) => {
        console.log(err.message)
        res.status(400).json({ err: err.message })
    })
    if (!task) {
        console.log(`there is no task with this id`)
        return res.status(404).json({ err: `there is no task with this id` })
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
        res.status(200).json({ msg: `task${msg} deleted successfully` })
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
    await Task.findOneAndUpdate({ user: req.user.userId, _id: req.params.id },{ user: req.user.userId, ...req.body })
        .then((results) => {
            res.status(201).json({ msg: "Task has been successfully updated." })
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