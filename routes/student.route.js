const express = require("express");
const { studentLogin, editStudent, fetchImage, deleteStudent, getTeachers, submitFeedback, fetchAttendance, fetchMarks } = require("../controllers/studentController");
const { authenticate } = require("../middlewares/student.middleware");
const router = express.Router();


//students login
router.post("/login", studentLogin)

router.patch("/:studentId",  editStudent)

router.delete("/:studentId",  deleteStudent)
//fetch ProfileImage
router.post("/fetchimage",  fetchImage)

router.get("/listteachers",  getTeachers)

router.post("/submitFeedback",  submitFeedback)

router.post("/attendance",  fetchAttendance)

router.post("/marks",  fetchMarks)

module.exports = router;
