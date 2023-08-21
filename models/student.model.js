const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  userType: {
    type: String,
    default: "student",
  },

  studentID: {
    type: Number,
    required: true,
  },

  studentName: {
    type: String,
  },

  mobile: {
    type: Number,
    minlength: 10,
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
division:{
  type:String,
  required:true
}, 
  DOB: {
    type: String,
  },
  marks:{
      term1:{
       type:Object
      },
      term2:{
        type:Object
      },
      term3:{
        type:Object
      }
  },
  address: {
    type: String,
  },
  classname: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'class',
    required: true
  },
  image: { 
    type: String,
    default:
      "https://res.cloudinary.com/diverse/image/upload/v1674562453/diverse/oipm1ecb1yudf9eln7az.jpg",
  },

  details: {
    type: String,
  },
});

const StudentModel = mongoose.model("student", studentSchema);

module.exports = { StudentModel };
