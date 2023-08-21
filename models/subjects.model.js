const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema({
    class: {
        type: String,
        required: true
    },
    subject: {
        type: [String],
        required: true
    }
});

subjectSchema.pre("save", function (next) {
    this.subject = this.subject.map((item) => item.toUpperCase());
    next();
});

const SubjectModel = mongoose.model("Subject", subjectSchema);

module.exports = {SubjectModel};
