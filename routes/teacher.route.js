const express = require("express");
const { TeacherModel } = require("../models/teacher.model");
require("dotenv").config();
const { uploads } = require("../middlewares/multer");
const { teacherLogin, teacherRegister, editTeacher, classStudents, uploadmark, findStudents, getAttendanceData, markAttendance, applyLeave, attendateMarkedDates, fetchImage, leaveStatus } = require("../controllers/teacherController");
const { authenticate } = require("../middlewares/teacher.middleware");
const router = express.Router();



//login teacher
router.post('/login', teacherLogin)
//register a teacher
router.post("/register", uploads.single('image'), teacherRegister)
//edit profile
router.patch("/:teacherId", editTeacher)
//students on a class of class teacher
router.post("/findStudents", findStudents)
//upload marks
router.post("/setMarks", uploadmark)
//show class students
router.post("/classStudnets", classStudents)
//show attendance data
router.post("/attendancedata", getAttendanceData)
//mark attendance
router.post('/markattendance', markAttendance)
//find Students
router.get("/datelist", attendateMarkedDates)

//apply leave
router.post('/applyleave', applyLeave)

router.post('/leavestatus', leaveStatus)
//fetch profile image
router.post("/fetchimage", fetchImage)

router.delete("/:teacherId", async (req, res) => {
  const id = req.params.teacherId;
  try {
    const teacher = await TeacherModel.findByIdAndDelete({ _id: id });
    if (!teacher) {
      res.status(404).send({ msg: `Teacher with id ${id} not found` });
    }
    res.status(200).send(`Teacher with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});


module.exports = router;
