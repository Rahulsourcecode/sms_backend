const express = require("express");
require("dotenv").config();
const { uploads } = require("../middlewares/multer");
const { adminRegister, adminLogin, editAdmin, getAllTeachers, createNotice, createClass, getClasses, registerStudent, allstudents, createSubjects, getSubjects, deleteAdmin, sendDetails, getNotices, LeaveList, LeaveStatus, feebackList } = require("../controllers/adminController");
const { authenticate } = require("../middlewares/admin.middleware");


const router = express.Router();
//login admin
router.post("/login", adminLogin)

//register admin
router.post("/register",  adminRegister)


//edit admin
router.patch("/:adminId",  editAdmin)

//get all teachers  
router.get("/teachers/all",  getAllTeachers)

//create notices
router.post("/createnotice",  createNotice)

//get all notices
router.get("/getnotices",  getNotices)

//create class

router.post("/createclass",  createClass)

//show all classes
router.get("/getclasses",  getClasses)

//register student

router.post("/studentregister",  uploads.single('image'), registerStudent)

//get all students
router.get("/allstudents",  allstudents)
//create subjects
router.post('/createSubjects',  createSubjects)

//get subjects
router.get('/getsubjects',  getSubjects)
//edit admin
router.patch("/:adminId",  editAdmin)
//delete admin
router.delete("/:adminId",  deleteAdmin)
//send password and userid to mail
router.post("/password",  sendDetails)
//get all leave list
router.get("/getleaves",  LeaveList)
//leave approval
router.post("/leaveapprovel",  LeaveStatus)

router.get('/getfeedback',  feebackList)

module.exports = router;


