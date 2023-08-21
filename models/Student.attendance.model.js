const mongoose = require('mongoose')

const StudentAttendanceSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    student: {
        type: String,
        required: true
    },
    division: {
        type: String
    },
    class: {
        type: String
    }
})


const studentAttendance = mongoose.model("studentattendance", StudentAttendanceSchema)

module.exports = { studentAttendance }