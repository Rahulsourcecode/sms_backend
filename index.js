const express = require("express")
const { connection } = require("./Config/db")
require("dotenv").config();
const cors = require("cors");
const morgan = require('morgan')
const socket = require('socket.io')
const adminRouter = require('./routes/admin.route')
const teacherRouter = require('./routes/teacher.route')
const studentRouter = require('./routes/student.route');
const generalRouter = require('./routes/general.route');
const messageRouter = require('./routes/messageRouter');
const schoolRouter = require("./routes/school.route");
const cookieParser = require("cookie-parser")
const app = express()

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: "https://schoolmanagementsystem-ou8d.onrender.com",
}));

app.use(express.static('public'));
morgan('default')
app.get("/", (req, res) => {
    res.send("Homepage")
})

app.use(cookieParser())
app.use("/admin", adminRouter);
app.use('/teachers', teacherRouter);
app.use('/students', studentRouter);
app.use("/messages", messageRouter);
app.use("/general", generalRouter);
app.use("/school", schoolRouter);

const server = app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("Connected to DB");
    } catch (error) {
        console.log("Unable to connect to DB");
        console.log(error);
    }
    console.log(`Listening at port ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin: "https://schoolmanagementsystem-ou8d.onrender.com",
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data);
        }
    });
});

