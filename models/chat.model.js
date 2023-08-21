const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        message: {
            type: String, required: true },
        reciever: {
            type: String,

        },
        sender: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("message", messageSchema);