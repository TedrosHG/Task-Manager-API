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
        trim: true
    },
    note: {
        type: String,
        trim: true,
    },
    dateTime: {
        type: Date,
        required: [true, 'Please provide date'],
    },
    duration: {
        type: String,
        required: true,
        enum: ["15 mins", "30 mins", "1 hrs", "2 hrs","6 hrs","12 hrs"],
        default: "30 mins",
    },
    priority: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5],
        default: 1,
    },
    reminder: {
        type: String,
        required: true,
        enum: ["15 mins", "30 mins", "1 hrs", "2 hrs"],
        default: "30 mins",
    },
    status: {
        type: String,
        required: true,
        enum: ["In progress", "Overdue", "Canceled", "Done", "Upcoming"],
        default: "Upcoming",
    },
},
{ timestamps: true }
)

// Export model
module.exports = mongoose.model('SubTask', SubTaskSchema)