const express = require("express");
const { AdminModel } = require("../models/admin.model")
const { NoticeModel } = require("../models/notice.model");
const { Myclass } = require("../models/class.model");
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { StudentModel } = require("../models/student.model");
const { TeacherModel } = require("../models/teacher.model");
const { uploads } = require("../middlewares/multer");
const { SubjectModel } = require("../models/subjects.model");
const { leaveModel } = require("../models/leave.model");
const { FeedbackModel } = require("../models/feedbacks.model");
let token;


const adminRegister = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await AdminModel.findOne({ email });
        if (admin) {
            return res.send({
                message: "Admin already exists",
            });
        }
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        let value = new AdminModel({ email, password: hashedPassword });
        await value.save();
        const data = await AdminModel.findOne({ email });
        return res.send({ data, message: "Registered" });
    } catch (error) {
        res.send({ message: "Error" });
    }
};

const adminLogin = async (req, res) => {
    // console.log(req.cookies.token)
    const { adminID, password } = req.body;
    try {
        const admin = await AdminModel.findOne({ adminID });

        if (admin) {
            // Compare the entered password with the hashed password
            const match = await bcrypt.compare(password, admin.password);

            if (match) {
                token = jwt.sign({ adminID }, process.env.key, {
                    expiresIn: "1d",
                });
                return res.cookie('token', token, {
                    path: "/",
                    expires: new Date(Date.now() + 1000 * 60 * 60),
                    SameSite: 'None',
                    secure: true,
                }).send({ message: "Successful", user: admin, token: token });
            }
        }
        res.send({ message: "Wrong credentials" });
    } catch (error) {
        console.log({ message: "Error" });
        console.log(error);
    }
};

const editAdmin = async (req, res) => {
    const id = req.params.adminId;
    const payload = req.body;
    try {
        await AdminModel.findByIdAndUpdate({ _id: id }, payload);
        const admin = await AdminModel.findById(id);
        if (!admin) {
            return res
                .status(404)
                .send({ message: `admin with id ${id} not found` });
        }
        res.status(200).send({ message: `Admin Updated`, user: admin, token: token });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: "Something went wrong, unable to Update." });
    }
};

const deleteAdmin = async (req, res) => {
    const id = req.params.adminId;
    try {
        const admin = await AdminModel.findByIdAndDelete({ _id: id });
        if (!admin) {
            res.status(404).send({ msg: `Admin with id ${id} not found` });
        }
        res.status(200).send(`Admin with id ${id} deleted`);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: "Something went wrong, unable to Delete." });
    }
}

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await TeacherModel.find();
        res.status(200).send(teachers);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: "Something went wrong" });
    }
};

const createNotice = async (req, res) => {
    const { title, details, date } = req.body;
    try {
        const notice = new NoticeModel({ title, details, date });
        await notice.save();
        res.status(200).send(notice);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: "Something went wrong" });
    }
};


const createClass = async (req, res) => {

    const { name } = req.body;
    console.log(req.body)
    try {
        const cls = new Myclass({
            name
        });
        await cls.save();
        res.status(200).send("Class created successfully");
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: "Something went wrong" });
    }
};


const getClasses = async (req, res) => {
    try {
        console.log("this is getclass")
        const classes = await Myclass.find();
        res.status(200).send(classes);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: "Something went wrong" });
    }
};

const registerStudent = async (req, res) => {
    console.log(req.body)
    console.log(req.file.filename)
    const { classname, email } = req.body;
    console.log("name of class" + classname)
    try {
        const admin = await AdminModel.findOne({ email });
        const teacher = await TeacherModel.findOne({ email })
        const student = await StudentModel.findOne({ email });
        if (student || admin || teacher) {
            return res.send({
                message: "Student already exists",
            });
        }
        const classDivision = await Myclass.findOne({ _id: classname });
        console.log("full data" + classDivision)
        console.log(classDivision.division)
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPassword)
        const studentData = { ...req.body, password: hashedPassword, division: classDivision.division, image: req.file.filename, studentID: Date.now() }
        let value = new StudentModel(studentData);
        await value.save();
        const data = await StudentModel.findOne({ email });
        const classdata = await Myclass.findOneAndUpdate(
            { _id: classname },
            { $inc: { strength: 1 }, $push: { student: data._id } },
            { new: true })
        classdata.inc()
        return res.send({ data, message: "Registered" });
    } catch (error) {
        res.send({ message: error });
    }
};

const allstudents = async (req, res) => {
    try {
        const student = await StudentModel.find().populate('classname')
        res.status(200).send(student)
    } catch (error) {
        res.status(200).json({ message: "error occured !" })
    }
}

const createSubjects = async (req, res) => {
    console.log(req.body)
    try {
        const subject = new SubjectModel({
            class: req.body.class,
            subject: req.body.subject
        })
        await subject.save()
        if (subject) {
            res.status(200).json({ message: "succesfully added" })
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ message: "duplicate addition to classes" })
    }
}


const getSubjects = async (req, res) => {
    try {
        const subjects = await SubjectModel.find()
        if (subjects) {
            res.status(200).send(subjects)
        }
    } catch (error) {
        console.log(error)
    }
};

const getNotices = async (req, res) => {
    try {
        const notices = await NoticeModel.find();
        res.status(200).send(notices);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: "Something went wrong" });
    }
};

const sendDetails = async (req, res) => {
    const { email, userId, password } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MID,
            pass: process.env.MPD,
        },
    });

    const mailOptions = {
        from: process.env.MID,
        to: email,
        subject: "Account ID and Password",
        text: `This is your User Id : ${userId} and  Password : ${password} .`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.send(error);
        }
        return res.send("Password reset email sent");
    });
};

const LeaveList = async (req, res) => {
    try {
        const leaveLists = await leaveModel.find().populate('staffData');
        if (LeaveList) {
            res.status(200).send(leaveLists)
        } else {
            res.status(400).json({ error: true })
        }
    } catch (error) {
        console.log(error)
    }
}

const LeaveStatus = async (req, res) => {
    try {
        const { option, remark, id } = req.body
        if (option === "approve") {
            const status = await leaveModel.update({ _id: id }, { isApproved: true, remarks: remark, entered: 1 })
            if (status) {
                res.status(200).json({ message: "success" })
            }
        } else {
            const status = await leaveModel.update({ _id: id }, { isApproved: false, remarks: remark, entered: 1 })
            if (status) {
                res.status(200).json({ message: "success" })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "error" })
    }
}

const feebackList = async (req, res) => {
    try {
        const list = await FeedbackModel.find({}).populate("studentId").populate('teacher')
        if (!list) {
            return res.status(400).json({ message: "error" })
        }
        console.log(list)
        return res.status(200).json({ data: list, message: "success" })
    } catch (error) {
        return res.status(404).jsnon({ message: "error" })
    }
}

module.exports = {
    adminRegister,
    adminLogin,
    editAdmin,
    deleteAdmin,
    getAllTeachers,
    createNotice,
    createClass,
    getClasses,
    registerStudent,
    allstudents,
    createSubjects,
    getSubjects,
    sendDetails,
    getNotices,
    LeaveList,
    LeaveStatus,
    feebackList
}