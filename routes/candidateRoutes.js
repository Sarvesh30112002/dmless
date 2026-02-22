const express = require("express");
const Job = require("../models/Job");
const Candidate = require("../models/Candidate");

const upload = require("../middleware/upload");
const { uploadResume } = require("../controllers/candidateController");

const router = express.Router();

/* ----------------------------------------
   Show candidate MCQ page
---------------------------------------- */
router.get("/apply/:publicId", async (req, res) => {
  try {
    const job = await Job.findOne({ publicId: req.params.publicId });

    if (!job) {
      return res.send("Invalid hiring link");
    }

    res.render("apply", { job });

  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
});


/* ----------------------------------------
   Submit MCQs
---------------------------------------- */
router.post("/apply/:publicId", async (req, res) => {
  try {

    const job = await Job.findOne({ publicId: req.params.publicId });

    if (!job) {
      return res.send("Invalid hiring link");
    }

    const { fullName, email } = req.body;

    const selectedAnswers = [];

    for (let i = 0; i < job.mcqs.length; i++) {
      selectedAnswers.push(Number(req.body[`q${i}`]));
    }

    let isKnockedOut = false;

    for (let i = 0; i < job.mcqs.length; i++) {
      if (selectedAnswers[i] !== job.mcqs[i].correctAnswerIndex) {
        isKnockedOut = true;
        break;
      }
    }

    const candidate = new Candidate({
      job: job._id,
      fullName,
      email,
      selectedAnswers,
      isKnockedOut,
      status: isKnockedOut ? "knocked" : "shortlisted"
    });

    await candidate.save();

    if (isKnockedOut) {
      return res.render("candidateResult", {
        passed: false
      });
    }

    return res.render("candidateResult", {
      passed: true,
      candidateId: candidate._id
    });

  } catch (err) {
    console.log(err);
    res.send("Something went wrong");
  }
});


/* ----------------------------------------
   Resume upload page (GET)
---------------------------------------- */
router.get("/upload-resume/:candidateId", (req, res) => {
  res.render("uploadResume", {
    candidateId: req.params.candidateId
  });
});


/* ----------------------------------------
   Resume upload API (POST)
---------------------------------------- */
router.post(
  "/upload-resume/:candidateId",
  upload.single("resume"),
  uploadResume
);

module.exports = router;