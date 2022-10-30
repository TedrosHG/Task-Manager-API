const Task = require('../models/task')
const SubTask = require('../models/subTask')
const schedule = require('node-schedule')
const moment = require('moment')
const webPush = require('web-push')

const publicVapidKey = process.env.PUBLIC_KEYS
const privateVapidKey = process.env.PRIVATE_KEYS

webPush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)


const reminderSchedule = async (req, res) => {
    console.log('reminder Schedule')
    const subscribe = req.body
    
    //schedule.cancelJob('reminder')
  
    schedule.scheduleJob('reminder','*/1 * * * *', async () => {
        //console.log('Schedule')
        //console.log(subscribe, req.user.userId)
        let tasks = await Task.find({ user: req.user.userId })
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
                            console.log('send tesk reminder')
                            const payload = JSON.stringify({
                                title: 'Task Reminder',
                                body: `task with title: ${task.title} will start 
                                at ${task.dateTime}, and will end in ${task.duration}`,
                            })
                            //console.log(payload) 
                            webPush.sendNotification(subscribe, payload)
                            .then(async result => {
                                await task.updateOne({ reminderStatus: true })
                                .catch((err) => {
                                    console.log(err);
                                })
                            })
                            .catch(err => console.error(err))
                            
                            
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
        if (subTasks) {
            subTasks.forEach(async subTask => {
                await Task.findOne({ _id: subTask.task, user: req.user.userId })
                    .then(async (result) => {
                        if (result) {
                            let remiderMins;
                            subTask.reminder.split(' ')[1] == 'mins' ?
                                remiderMins = moment(subTask.dateTime).subtract(subTask.reminder.split(' ')[0], 'm').toDate() :
                                subTask.reminder.split(' ')[1] == 'hrs' ?
                                    remiderMins = moment(subTask.dateTime).subtract(subTask.reminder.split(' ')[0], 'h').toDate() : 0
                            const dateNow = new Date(Date.now()).toISOString()

                            if (subTask.status == 'Upcoming') {

                                if (remiderMins <= new Date(dateNow)) {
                                    if (!subTask.reminderStatus) {
                                        console.log('send sub tesk reminder')
                                        const payload = JSON.stringify({
                                            title: 'SubTask Reminder',
                                            body: `subTask with title: ${subTask.title} will start at ${subTask.dateTime},
                                             and will end in ${subTask.duration}`,
                                        })
                                       // console.log(payload)
                                        webPush.sendNotification(subscribe, payload)
                                        .then(async result=> {
                                           await subTask.updateOne({ reminderStatus: true })
                                            .catch((err) => {
                                                console.log(err);
                                            }) 
                                        })
                                        .catch(err => console.error(err))
                                        

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
                            
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })

            })
        }
    })



}

const statusSchedule = async (req, res) => {
    console.log('status Schedule')
    let tasks = await Task.find()
        .catch((err) => {
            console.log(err)
        })
    let subTasks = await SubTask.find()
        .catch((err2) => {
            console.log(err2)
        })
    if (tasks) {
        tasks.forEach(async task => {
            let durationMins;
            task.duration.split(' ')[1] == 'mins' ?
                durationMins = moment(task.dateTime).add(task.duration.split(' ')[0], 'm').toDate() :
                task.duration.split(' ')[1] == 'hrs' ?
                    durationMins = moment(task.dateTime).add(task.duration.split(' ')[0], 'h').toDate() : 0

            if (task.status != "Done" && task.status != "Canceled") {

                if (task.dateTime <= Date.now() && durationMins > Date.now()) {
                    if (task.status != 'In progress') {
                        await task.updateOne({ status: 'In progress' })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                } else if (durationMins <= Date.now()) {
                    if (task.status != 'Overdue') {
                        await task.updateOne({ status: 'Overdue' })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                } else if (task.dateTime >= Date.now()) {
                    if (task.status != 'Upcoming') {
                        await task.updateOne({ status: 'Upcoming' })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                }
            }

        })
    }
    if (subTasks) {
        subTasks.forEach(async subTask => {
            let durationMins;
            subTask.duration.split(' ')[1] == 'mins' ?
                durationMins = moment(subTask.dateTime).add(subTask.duration.split(' ')[0], 'm').toDate() :
                subTask.duration.split(' ')[1] == 'hrs' ?
                    durationMins = moment(subTask.dateTime).add(subTask.duration.split(' ')[0], 'h').toDate() : 0

            if (subTask.status != "Done" && subTask.status != "Canceled") {

                if (subTask.dateTime <= Date.now() && durationMins > Date.now()) {

                    if (subTask.status != 'In progress') {
                        await subTask.updateOne({ status: 'In progress' })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                } else if (durationMins <= Date.now()) {
                    if (subTask.status != 'Overdue') {
                        await subTask.updateOne({ status: 'Overdue' })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                } else if (subTask.dateTime >= Date.now()) {
                    if (subTask.status != 'Upcoming') {
                        await subTask.updateOne({ status: 'Upcoming' })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                }
            }

        })
    }
}



module.exports = {
    reminderSchedule,
    statusSchedule,
}