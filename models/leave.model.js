const mongoose = require('mongoose')

const leaveSchema = mongoose.Schema({

    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    isApproved: {
        default: false,
        type: Boolean

    },
    remarks: {
        type: String,

    },
    entered: {
        type: Number,
        default: 0,
        required: true
    },
    staffData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    }
})

const leaveModel = mongoose.model('leave', leaveSchema)

module.exports = { leaveModel };