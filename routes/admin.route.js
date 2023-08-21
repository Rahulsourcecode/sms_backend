const express = require("express");
require("dotenv").config();
const { uploads } = require("../middlewares/multer");
const { adminRegister, adminLogin, editAdmin, getAllTeachers, createNotice, createClass, getClasses, registerStudent, allstudents, createSubjects, getSubjects, deleteAdmin, sendDetails, getNotices, LeaveList, LeaveStatus, feebackList } = require("../controllers/adminController");
const { authenticate } = require("../middlewares/admin.middleware");


const router = express.Router();
//login admin
router.post("/login", adminLogin)

//register admin
router.post("/register", authenticate, adminRegister)


//edit admin
router.patch("/:adminId", authenticate, editAdmin)

//get all teachers  
router.get("/teachers/all", authenticate, getAllTeachers)

//create notices
router.post("/createnotice", authenticate, createNotice)

//get all notices
router.get("/getnotices", authenticate, getNotices)

//create class

router.post("/createclass", authenticate, createClass)

//show all classes
router.get("/getclasses", authenticate, getClasses)

//register student

router.post("/studentregister", authenticate, uploads.single('image'), registerStudent)

//get all students
router.get("/allstudents", authenticate, allstudents)
//create subjects
router.post('/createSubjects', authenticate, createSubjects)

//get subjects
router.get('/getsubjects', authenticate, getSubjects)
//edit admin
router.patch("/:adminId", authenticate, editAdmin)
//delete admin
router.delete("/:adminId", authenticate, deleteAdmin)
//send password and userid to mail
router.post("/password", authenticate, sendDetails)
//get all leave list
router.get("/getleaves", authenticate, LeaveList)
//leave approval
router.post("/leaveapprovel", authenticate, LeaveStatus)

router.get('/getfeedback', authenticate, feebackList)

module.exports = router;


