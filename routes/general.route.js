const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const { TeacherModel } = require('../models/teacher.model');
const { StudentModel } = require('../models/student.model');
const { AdminModel } = require('../models/admin.model');
const nodemailer = require('nodemailer');
const { Doubts } = require('../models/doubt.model');
require("dotenv").config()
let otp;
let user;
let userName;
let userID
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MID,
    pass: process.env.MPD,
  },
});

router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  console.log(req.body);

  try {
    const student = await StudentModel.findOne({ email: email });
    const teacher = await TeacherModel.findOne({ email: email });
    const admin = await AdminModel.findOne({ email: email });

    if (student || teacher || admin) {
      //storing user
      if (student) {
        user = email
        userName = "student"
        userID = await StudentModel.findOne({ email: email })
        userID = userID.studentID
      }
      if (teacher) {
        user = email
        userName = "teacher"
        userID = await TeacherModel.findOne({ email: email })
        userID = userID.teacherID
      }
      if (admin) {
        user = email
        userName = "admin"
        userID = await AdminModel.findOne({ email: email })
        userID = userID.adminID

      }
      // Generate a 4-digit OTP

      otp = Math.floor(1000 + Math.random() * 9000);
      console.log("otp:" + otp)
      // Send the OTP via email
      const mailOptions = {
        from: process.env.MID,
        to: email,
        subject: 'Password Reset OTP',
        text: `Hy user ${userID} Your OTP for password reset is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(200).json({ message: "Failed to send OTP" });
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(200).json({ message: "OTP sent successfully" });
        }
      });
    } else {
      console.log('no user found');
      return res.status(200).json({ message: "Wrong credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "Something went wrong" });
  }
});

//VerifyOtp

router.post("/Verifyotp", async (req, res) => {
  try {
    console.log(req.body)
    console.log(otp)
    if (req.body.otp == otp) {
      res.status(200).json({ message: "Success" })
    } else {
      res.status(200).json({ message: "invalid OTP!" })
    }
  } catch (error) {

  }
})

router.post('/resetpassword', async (req, res) => {
  try {

    const { password1 } = req.body;

    if (userName === 'admin') {
      const hashedPassword = await bcrypt.hash(password1, 10);
      await AdminModel.updateOne({ email: user }, { password: hashedPassword });
      // Password reset for admin is successful
      res.status(200).json({ message: 'Password reset successful' });
    } else if (userName === 'student') {
      const hashedPassword = await bcrypt.hash(password1, 10);
      await StudentModel.updateOne({ email: user }, { password: hashedPassword });
      // Password reset for student is successful
      res.status(200).json({ message: 'Password reset successful' });
    } else if (userName === 'teacher') {
      const hashedPassword = await bcrypt.hash(password1, 10);
      await TeacherModel.updateOne({ email: user }, { password: hashedPassword });
      // Password reset for teacher is successful
      res.status(200).json({ message: 'Password reset successful' });
    } else {
      // No user found
      res.status(200).json({ message: 'No user found' });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: 'Something went wrong' });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const id = req.body.ID;
    const logindataAdmin = await AdminModel.findOne({ adminID: id });
    const logindataStudent = await StudentModel.findOne({ studentID: id });
    const logindataTeacher = await TeacherModel.findOne({ teacherID: id });
    if (logindataAdmin) {
      return res.status(200).json({ message: "Admin" })
    }
    else if (logindataStudent) {
      return res.status(200).json({ message: "Student" })
    }
    else if (logindataTeacher) {
      return res.status(200).json({ message: "Teacher" })
    } else {
      return res.status(200).json({ message: "invalid" })
    }

  } catch (error) {

  }
})

router.post("/askdoubt", async (req, res) => {
  try {
    const { id, title, description } = req.body
    const userid = await StudentModel.findOne({ _id: id })
    if (userid) {
      const doubt = new Doubts({
        userId: id,
        title,
        description
      })
      const finalise = await doubt.save()
      if (finalise) {
        res.status(200).json({ message: "success" })
      }
    } else {
      res.status(200).json({ message: "error occured" })
    }
  } catch (error) {
    req.status(400).json({ message: "error" })
    console.log(error)
  }
})

router.get("/showDoubts", async (req, res) => {
  try {
    const data = await Doubts.find().populate('userId')
    if (data) {
      res.send(data).status(200).json({ message: "data" })
    } else {
      res.status(400)
    }
  } catch (error) {
    console.log(error.message);
  }
})

router.post("/addAnswers", async (req, res) => {
  try {
    const { answer, userid, postid, img, userType, username } = req.body
    const updatedDoubt = await Doubts.findOneAndUpdate(
      { _id: postid },
      { $addToSet: { answers: { userId: userid, answer: answer, username: username, userType: userType, img: img } } },
      { new: true, upsert: true }
    );

    if (!updatedDoubt) {

      return res.send(400).send({ error: "failed" });
    }
    return res.status(200).send({ message: "success" })
  } catch (error) {
    return res.status(400).json({ error: "failed to add" });
  }
});


router.post("/upvotes", async (req, res) => {
  try {
    const { ansid, userId } = req.body;
    console.log(req.body);
    const result = await Doubts.findOne({
      "answers": { $elemMatch: { _id: ansid } }
    })
    if (!result) {
      return res.status(404).json({ message: "Answer not found." })
    }
    const matchedAnswer = result.answers.find((answer) => answer._id.equals(ansid));
    if (!matchedAnswer) {
      return res.status(404).json({ message: "Answer not found." })
    }
    if (matchedAnswer.upvotes.includes(userId)) {
      matchedAnswer.upvotes = matchedAnswer.upvotes.filter(x => x !== userId)
    } else {
      matchedAnswer.upvotes.push(userId)
    }
    await result.save();
    res.json({ message: "Upvote added successfully.", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

router.post("/getall", async (req, res) => {
  try {
    console.log(req.body)
    let user;
    const { type } = req.body
    console.log(type)
    if (type === "student") {
      user = await TeacherModel.find({})
    }
    else {
      user = await StudentModel.find({})
    }
    if (!user) {
      return res.status(400).json({ message: "no records found" })
    }
    return res.status(200).send(user)
  } catch (error) {
    return res.status(400)
  }
})

//logout for all
router.get("/logout", async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).send('Cookie Cleared');
  } catch (error) {
    console.log(error);
    return res.status(400).send('Error clearing cookie');
  }

})

module.exports = router;
