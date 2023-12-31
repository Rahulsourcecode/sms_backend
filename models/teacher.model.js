const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema({
  userType: {
    type: String,
    default: "teacher",
  },

  teacherID: {
    type: Number,
    required: true,
  },

  teacherName: {
    type: String,
  },

  mobile: {
    type: Number,
  },

  email: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
  },

  gender: {
    type: String,
  },

  subject: {
    type: String,
  },

  DOB: {
    type: Date,
  },

  address: {
    type: String,
  },

  education: {
    type: String,
  },
  assignClass: {
    type: Array,
  },

  image: {
    type: String,
    default:
      "https://res.cloudinary.com/diverse/image/upload/v1674562453/diverse/oipm1ecb1yudf9eln7az.jpg",
  },

  details: {
    type: String,
  },
  classname: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'class',
    required: true
  },
  division: {
    type: String,
    required: true
  }
});

const TeacherModel = mongoose.model("teacher", teacherSchema);

module.exports = { TeacherModel };
