const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Please provide user'],
    },
    title: {
        type: String,
        required: [true, 'Please provide title'],
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
    category: {
        type: String,
        required: true,
        enum: ["Work", "Family", "Education", "Shopping", "Others"],
        default: "Others",
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
    reminderStatus: {
        type: Boolean,
        default: false,
    },
},
{ timestamps: true }
)

// Export model
module.exports = mongoose.model('Task', TaskSchema)