const Task = require('../models/task')
const SubTask = require('../models/subTask')
const Notification = require('../models/notification')
const moment = require('moment')

const notification = async (req, res) => {
    //console.log('notification')
    let listTask = []
    let tasks = await Task.find({})
        .catch((err) => {
            console.log(err)
        })
    //let subTasks = []
    subTasks = await SubTask.find()
        .catch((err2) => {
            console.log(err2)
        })
    if (tasks) {

        tasks.forEach(async task => {
            listTask[task._id]=task.user
            let remiderMins;
            task.reminder.split(' ')[1] == 'mins' ?
                remiderMins = moment(task.dateTime).subtract(task.reminder.split(' ')[0], 'm').toDate() :
                task.reminder.split(' ')[1] == 'hrs' ?
                    remiderMins = moment(task.dateTime).subtract(task.reminder.split(' ')[0], 'h').toDate() : 0
            const dateNow = new Date(Date.now()).toISOString()
            // const diffTime = Math.abs(remiderMins - Date.now());
            // console.log(diffTime/3600000)
            if (task.status == 'Upcoming') {

                if (remiderMins <= new Date(dateNow)) {
                    if (!task.reminderStatus) {
                        await Notification.create({ user: task.user, title: task.title })
                            .then(async result => {
                                await task.updateOne({ reminderStatus: true })
                                    .catch((err) => {
                                        console.log("reminder status error ", err);
                                    })
                            })
                            .catch((err) => {
                                console.log("notification error ", err);
                            })

                    }
                }
            } else {
                if (task.reminderStatus) {
                    await task.updateOne({ reminderStatus: false })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            }
            //console.log('task')
        })
    }
    //console.log('taskList',listTask)
    if (subTasks) {
        subTasks.forEach(async subTask => {
            let remiderMins;
            subTask.reminder.split(' ')[1] == 'mins' ?
                remiderMins = moment(subTask.dateTime).subtract(subTask.reminder.split(' ')[0], 'm').toDate() :
                subTask.reminder.split(' ')[1] == 'hrs' ?
                    remiderMins = moment(subTask.dateTime).subtract(subTask.reminder.split(' ')[0], 'h').toDate() : 0
            const dateNow = new Date(Date.now()).toISOString()

            if (subTask.status == 'Upcoming') {

                if (remiderMins <= new Date(dateNow)) {
                    if (!subTask.reminderStatus) {
                        await Notification.create({ user: listTask[subTask.task], title: subTask.title })
                            .then(async result => {
                                await subTask.updateOne({ reminderStatus: true })
                                    .catch((err) => {
                                        console.log("reminder status error ", err);
                                    })
                            })
                            .catch((err) => {
                                console.log("notification error ", err);
                            })
                    }
                }
            } else {
                if (subTask.reminderStatus) {
                    await subTask.updateOne({ reminderStatus: false })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            }



        })
    }

}

const notify = async (req, res) => {
    await Notification.find({ user: req.user.userId })
    .then(async (results) => {
        return res.status(200).json({ notification: results })
    })
    .catch((err) => {
        return res.status(400).json({ errss: err })
    })
}
 
const deleteNotification = async (req, res) => {
    if(!req.body._id){
        return res.status(400).json({ msg: "enter id of notification" })
    }
    await Notification.findOne({ user: req.user.userId, _id: req.body._id })
    .then(async (notification) => {
        if (!notification) {
            return res.status(404).json({ err: `there is no notification with this id` })
        } else {
            await notification.remove().then((result) => {
                return res.status(200).json({ msg: `notification deleted successfully` })
            }).catch((error) => {
                return res.status(500).json({ err: error.message })
            })
        }
    })
    .catch((err) => {
        return res.status(400).json({ err: err.message })
    })
}

module.exports = {
    notification,
    notify,
    deleteNotification
}