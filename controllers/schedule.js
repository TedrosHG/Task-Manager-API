const Task = require('../models/task')
const SubTask = require('../models/subTask')
const schedule = require('node-schedule')
const moment = require('moment')


// const reminderSchedule = async (req, res) => {
//     let tasks = await Task.find({ user: req.user.userId })
//     .catch((err) => {
//         console.log(err)
//     })
//     let subTasks = await SubTask.find()
//     .catch((err2) => {
//         console.log(err2)
//     })
//     tasks.forEach(task => {
//         //let date = task.dateTime - task.reminder
//     })
//     subTasks.forEach(subTask => {
//         //let date = subTask.dateTime - subTask.reminder
//         })
//     })
// }

const statusSchedule = async (req, res) => {
    let tasks = await Task.find()
    .catch((err) => {
        console.log(err)
    })
    let subTasks = await SubTask.find()
    .catch((err2) => {
        console.log(err2)
    })
    tasks.forEach(async task => {
        let durationMins;
        task.duration.split(' ')[1] == 'mins'? 
        durationMins=moment(task.dateTime).add(task.duration.split(' ')[0], 'm').toDate() : 
        task.duration.split(' ')[1] == 'hrs'? 
        durationMins=moment(task.dateTime).add(task.duration.split(' ')[0], 'h').toDate() : 0

        
        if(task.dateTime <= Date.now() && durationMins > Date.now()){
            if(task.status != 'In progress'){
                await task.updateOne({status: 'In progress'})
                .catch((err) => {
                    console.log(err);
                })
            }
        }else if(durationMins <= Date.now()){
            if(task.status != 'Overdue'){
                await task.updateOne({status: 'Overdue'})
                .catch((err) => {
                    console.log(err);
                })
            }
        }else if(task.dateTime >= Date.now()){
            if(task.status != 'Upcoming'){
                await task.updateOne({status: 'Upcoming'})
                .catch((err) => {
                    console.log(err);
                })
            }
        }
    })
    subTasks.forEach( async subTask => {
        let durationMins;
        subTask.duration.split(' ')[1] == 'mins'? 
        durationMins=moment(subTask.dateTime).add(subTask.duration.split(' ')[0], 'm').toDate() : 
        subTask.duration.split(' ')[1] == 'hrs'? 
        durationMins=moment(subTask.dateTime).add(subTask.duration.split(' ')[0], 'h').toDate() : 0

        
        if(subTask.dateTime <= Date.now() && durationMins > Date.now()){
            
            if(subTask.status != 'In progress'){
                await subTask.updateOne({status: 'In progress'})
                .catch((err) => {
                    console.log(err);
                })
            }
        }else if(durationMins <= Date.now()){
            if(subTask.status != 'Overdue'){
                await subTask.updateOne({status: 'Overdue'})
                .catch((err) => {
                    console.log(err);
                })
            }
        }else if(subTask.dateTime >= Date.now()){
            if(subTask.status != 'Upcoming'){
                await subTask.updateOne({status: 'Upcoming'})
                .catch((err) => {
                    console.log(err);
                })
            }
        }
    })
}



module.exports = {
    //reminderSchedule,
    statusSchedule,
}