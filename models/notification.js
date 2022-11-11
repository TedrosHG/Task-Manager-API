const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
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
    status: {
        type: String,
        required: true,
        enum: ["Overdue","Upcoming"],
        default: "Upcoming",
    },
},
{ timestamps: true }
)

// Export model
module.exports = mongoose.model('Notification', NotificationSchema)