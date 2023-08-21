const mongoose = require('mongoose')

const feedbackSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },
    feedback: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const FeedbackModel = mongoose.model('feedback', feedbackSchema);

module.exports = { FeedbackModel };