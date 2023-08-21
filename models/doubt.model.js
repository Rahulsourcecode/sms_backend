const mongoose = require('mongoose')

const doubtSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    answers: [{
        userId: {
            type: String,
        },
        username: {
            type: String
        },
        userType: {
            type: String
        },  
        img: {
            type: String
        },
        answer: {
            type: String,
        },
        upvotes:{
            default:0,
            type:Array,
        }
    }]

})

const Doubts = mongoose.model('doubt', doubtSchema)

module.exports = { Doubts } 