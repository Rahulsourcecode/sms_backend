const express = require("express");
const { studentLogin, editStudent, fetchImage, deleteStudent, getTeachers, submitFeedback, fetchAttendance, fetchMarks } = require("../controllers/studentController");
const { authenticate } = require("../middlewares/student.middleware");
const router = express.Router();


//students login
router.post("/login", studentLogin)

router.patch("/:studentId", authenticate, editStudent)

router.delete("/:studentId", authenticate, deleteStudent)
//fetch ProfileImage
router.post("/fetchimage", authenticate, fetchImage)

router.get("/listteachers", authenticate, getTeachers)

router.post("/submitFeedback", authenticate, submitFeedback)

router.post("/attendance", authenticate, fetchAttendance)

router.post("/marks", authenticate, fetchMarks)

module.exports = router;
