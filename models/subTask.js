const mongoose = require('mongoose')

const SubTaskSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "task",
        required: [true, 'Please provide task'],
    },
    title: {
        type: String,
        required: [true, 'Please provide title'],
        maxlength: 50,
        minlength: 3,
    },
    note: {
        type: String,
    },
    dataTime: {
        type: Date,
        required: [true, 'Please provide date'],
    },
    duration: {
        type: Number,
        required: [true, 'Please provide date'],
    },
    dataTime: {
        type: Date,
        required: [true, 'Please provide date'],
    },
    priority: {
        type: Number,
        required: [true, 'Please provide priority'],
        enum: [1, 2, 3, 4, 5],
        default: 1,
    },
    reminder: {
        type: String,
        required: [true, 'Please provide reminder'],
        enum: ["15mins", "30mins", "1hrs", "2hrs", "6hrs", "24hrs"],
        default: "30mins",
    },
    status: {
        type: String,
        required: [true, 'Please provide status'],
        enum: ["In progress", "Stuck", "Canceled", "Done", "Others"],
        default: "In progress",
    },
},
{ timestamps: true }
)

// Export model
module.exports = mongoose.model('SubTask', SubTaskSchema)