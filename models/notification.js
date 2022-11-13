const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["Overdue","Upcoming"],
        default: "Upcoming",
    },
},
{ timestamps: true }
)

// Export model
module.exports = mongoose.model('Notification', NotificationSchema)