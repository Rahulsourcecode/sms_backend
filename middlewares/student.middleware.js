const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.cookies.token
  if (token) {
    const decoded = jwt.verify(token, process.env.key);
    if (decoded) {
      const studentID = decoded.studentID;
      req.body.studentID = studentID;
      next();
    } else {
      res.send("You cannot edit this token.");
    }
  } else {
    res.status(400).send("Inadequate permissions, Please login first.");
  }
};

module.exports = { authenticate };
