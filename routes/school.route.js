const express = require("express");
const { AdminModel } = require("../models/admin.model");
const { TeacherModel } = require("../models/teacher.model");
const { StudentModel } = require("../models/student.model");
const { NoticeModel } = require("../models/notice.model");
const { FeedbackModel } = require("../models/feedbacks.model");
const { Myclass } = require("../models/class.model")
const { leaveModel } = require("../models/leave.model")

const router = express.Router();

router.get("/dash", async (req, res) => {
  try {
    let admins = await AdminModel.find({});
    let students = await StudentModel.find({});
    let teachers = await TeacherModel.find({});
    let notices = await NoticeModel.find({});
    let feedbacks = await FeedbackModel.find({});
    let classes = await Myclass.find({});
    let leaves = await leaveModel.find({});
    let data = {
      admin: admins?.length,
      student: students?.length,
      teacher: teachers?.length,
      notice: notices?.length,
      feedback: feedbacks?.length,
      classes: classes?.length,
      leave: leaves?.length,
    };
    console.log(data)
    res.status(200).send({ data });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong" });
  }
});

module.exports = router;

