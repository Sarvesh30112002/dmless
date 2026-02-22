const Candidate = require("../models/Candidate");
const Job = require("../models/Job");

/* ----------------------------------------
   Analytics for a single hiring link
---------------------------------------- */

exports.getJobAnalytics = async (req, res) => {
  try {

    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const totalCandidates = await Candidate.countDocuments({
      job: jobId
    });

    const knockedOutCount = await Candidate.countDocuments({
      job: jobId,
      isKnockedOut: true
    });

    const shortlistedCount = await Candidate.countDocuments({
      job: jobId,
      isKnockedOut: false
    });

    const resumeUploadedCount = await Candidate.countDocuments({
      job: jobId,
      resumeUrl: { $exists: true, $ne: "" }
    });

    res.status(200).json({
      jobId: jobId,
      jobRole: job.jobRole,
      totalCandidates,
      knockedOutCount,
      shortlistedCount,
      resumeUploadedCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};


/* ----------------------------------------
   All jobs analytics of recruiter
---------------------------------------- */

exports.getAllJobsAnalytics = async (req, res) => {
  try {

    const recruiterId = req.recruiter._id;
    const jobs = await Job.find({ recruiter: recruiterId });

    const analytics = [];

    for (const job of jobs) {

      const totalCandidates = await Candidate.countDocuments({
        job: job._id
      });

      const knockedOutCount = await Candidate.countDocuments({
        job: job._id,
        isKnockedOut: true
      });

      const shortlistedCount = await Candidate.countDocuments({
        job: job._id,
        isKnockedOut: false
      });

      const resumeUploadedCount = await Candidate.countDocuments({
        job: job._id,
        resumeUrl: { $exists: true, $ne: "" }
      });

      analytics.push({
        jobId: job._id,
        jobRole: job.jobRole,
        publicId: job.publicId,
        totalCandidates,
        knockedOutCount,
        shortlistedCount,
        resumeUploadedCount
      });

    }

    res.status(200).json(analytics);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};