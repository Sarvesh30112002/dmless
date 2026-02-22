const express = require("express");
const { v4: uuidv4 } = require("uuid");
const protect = require("../middleware/authMiddleware");
const Job = require("../models/Job");

const router = express.Router();

/* -----------------------------------
   Show create job form
----------------------------------- */
router.get("/jobs/new", protect, (req, res) => {
  res.render("createJob");
});

/* -----------------------------------
   Create job
----------------------------------- */
router.post("/jobs", protect, async (req, res) => {
  try {

    const { jobRole, jobDescription } = req.body;

    // build mcqs array from form
    const mcqs = [];

    for (let i = 1; i <= 5; i++) {

      const question = req.body[`q${i}`];
      const options = [
        req.body[`q${i}_o1`],
        req.body[`q${i}_o2`],
        req.body[`q${i}_o3`],
        req.body[`q${i}_o4`]
      ];

      const correctAnswerIndex = Number(req.body[`q${i}_correct`]);

      mcqs.push({
        question,
        options,
        correctAnswerIndex
      });
    }

    const job = new Job({
      recruiter: req.recruiter._id,
      jobRole,
      jobDescription,
      mcqs,
      publicId: uuidv4()
    });

    await job.save();

    res.redirect("/dashboard");

  } catch (error) {
    console.log(error);
    res.send("Error creating job");
  }
});

module.exports = router;