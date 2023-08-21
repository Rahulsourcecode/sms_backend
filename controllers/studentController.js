const { StudentModel } = require("../models/student.model");
require("dotenv").config();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const { TeacherModel } = require("../models/teacher.model");
const { FeedbackModel } = require("../models/feedbacks.model");
const { studentAttendance } = require("../models/Student.attendance.model");
let token;

const studentLogin = async (req, res) => {
  const { studentID, password } = req.body;
  try {
    const student = await StudentModel.findOne({ studentID });
    if (student) {
      const passwordSuccess = bcrypt.compare(password, student.password)
      if (passwordSuccess) {
        token = jwt.sign({ foo: "bar" }, process.env.key, {
          expiresIn: "24h",
        });
        return res.cookie('token', token, {
          path: "/",
          expires: new Date(Date.now() + 1000 * 60 * 60),
          httpOnly: true,
          SameSite: 'None',
          secure: true,
        }).send({ message: "Successful", user: student, token: token });
      } else {
        res.send({ message: "Wrong credentials" });
      }
    } else {
      res.status(400).json({ message: "user not found" })
    }
  } catch (error) {
    console.log({ message: "Error" });
    console.log(error);
  }
};


const editStudent = async (req, res) => {
  const id = req.params.studentId;
  const payload = req.body;
  try {
    await StudentModel.findByIdAndUpdate({ _id: id }, payload);
    const student = await StudentModel.findById(id);
    if (!student) {
      return res.status(404).send({ message: `Student with id ${id} not found` });
    }
    res.status(200).send({ message: `Student Updated`, user: student ,token: token });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Update." });
  }
};


const fetchImage = async (req, res) => {
  try {
    const student = await StudentModel.findOne({ _id: req.body.id });
    if (!student) {
      // Handle case when teacher is not found
      return res.status(404).json({ error: "Student not found" });
    }
    const imagePath = student.image;
    res.json({ imagePath });
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteStudent = async (req, res) => {
  const id = req.params.studentId;
  try {
    const student = await StudentModel.findByIdAndDelete({ _id: id });
    if (!student) {
      res.status(404).send({ msg: `Student with id ${id} not found` });
    }
    res.status(200).send(`tudent with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await TeacherModel.find({});
    console.log(teachers)
    if (!teachers) {
      return res.status(400).json({ message: "error" })
    }
    return res.send(teachers).status(200)
  } catch (error) {
    return res.status(400).json({ message: "error" })
  }
}

const submitFeedback = async (req, res) => {
  try {
    const { teacher, feedback, studentId } = req.body;
    const feedbacks = new FeedbackModel({
      studentId,
      teacher,
      feedback,
    })
    const data = await feedbacks.save()
    if (!data) {
      return res.status(400).json({ message: "error" })
    }
    return res.status(200).json({ message: "success" })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: "error" })
  }
}

const fetchAttendance = async (req, res) => {
  try {
    const { id } = req.body
    const attendance = await studentAttendance.find({ student: id })
    console.log(attendance)
    if (!attendance) {
      return res.status(400).json({ message: "no data found" })
    }
    return res.status(200).send(attendance)
  } catch (error) {
    return res.status(400).json({ message: "error" })
  }
}
const fetchMarks = async (req, res) => {
  try {
    const { id } = req.body
    console.log(id)
    const student = await StudentModel.findOne({ studentID: id })
    console.log(student)
    if (!student) {
      return res.status(400).json({ message: "no data found" })
    }
    return res.status(200).send(student)
  } catch (error) {
    return res.status(400).json({ message: "error" })
  }
}

module.exports = {
  studentLogin,
  editStudent,
  fetchImage,
  deleteStudent,
  getTeachers,
  submitFeedback,
  fetchAttendance,
  fetchMarks
}