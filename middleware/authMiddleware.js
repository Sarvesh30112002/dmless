const jwt = require("jsonwebtoken");
const Recruiter = require("../models/Recruiter");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const recruiter = await Recruiter.findById(decoded.id).select("-password");

    if (!recruiter) {
      return res.redirect("/login");
    }

    req.recruiter = recruiter;

    next();

  } catch (error) {
    console.log(error);
    return res.redirect("/login");
  }
};

module.exports = protect;