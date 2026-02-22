const express = require("express");
const protect = require("../middleware/authMiddleware");
const Job = require("../models/Job");
const Candidate = require("../models/Candidate");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

router.get("/dashboard", protect, async (req, res) => {

  const jobs = await Job.find({ recruiter: req.recruiter._id })
                        .sort({ createdAt: -1 });

  const jobsWithCounts = [];

  for (let job of jobs) {

    const total = await Candidate.countDocuments({ job: job._id });

    const knocked = await Candidate.countDocuments({
      job: job._id,
      isKnockedOut: true
    });

    const shortlisted = await Candidate.countDocuments({
      job: job._id,
      isKnockedOut: false
    });

    jobsWithCounts.push({
      ...job.toObject(),
      total,
      knocked,
      shortlisted
    });

  }

  res.render("dashboard", {
    recruiter: req.recruiter,
    jobs: jobsWithCounts
  });

});

/*
|--------------------------------------------------------------------------
| GET → create job page
|--------------------------------------------------------------------------
*/
router.get("/jobs/new", protect, (req, res) => {
  res.render("createJob");
});


/*
|--------------------------------------------------------------------------
| POST → create job (this is what your form submits to)
|--------------------------------------------------------------------------
*/

router.post("/create-job", protect, async (req, res) => {
  try {

    const { jobRole, jobDescription, questions, options, correct } = req.body;

    const mcqs = [];

    // Ensure questions is always array
    const questionArray = Array.isArray(questions) ? questions : [questions];

    for (let i = 0; i < questionArray.length; i++) {

      if (!questionArray[i]) continue;

      mcqs.push({
        question: questionArray[i],
        options: options[i],
        correctAnswerIndex: Number(correct[i])
      });

    }

    // Validate minimum 1 question
    if (mcqs.length < 1) {
      return res.send("Please add at least 1 MCQ");
    }

    const job = await Job.create({
      recruiter: req.recruiter._id,
      jobRole,
      jobDescription,
      mcqs,
      publicId: uuidv4()   // ✅ REQUIRED
    });

    res.redirect("/dashboard");

  } catch (err) {
    console.log("Create job error:", err);
    res.send("Failed to create job");
  }
});


/* ----------------------------------------
   Analytics dashboard page
---------------------------------------- */

router.get("/dashboard/analytics", protect, (req, res) => {
  res.render("analytics");
});

/* ----------------------------------------
   Candidate list per job
---------------------------------------- */

router.get("/dashboard/job/:jobId/candidates", protect, async (req, res) => {

  const job = await Job.findById(req.params.jobId);

  if(!job){
    return res.send("Job not found");
  }

  const candidates = await Candidate.find({ job: job._id })
                                     .sort({ createdAt: -1 });

  res.render("candidatesList", {
    job,
    candidates
  });

});

module.exports = router;