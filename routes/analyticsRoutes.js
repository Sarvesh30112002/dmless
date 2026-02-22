const express = require("express");
const {
  getJobAnalytics,
  getAllJobsAnalytics
} = require("../controllers/analyticsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard/analytics/job/:jobId",
  protect,
  getJobAnalytics
);

router.get(
  "/dashboard/analytics/all",
  protect,
  getAllJobsAnalytics
);

module.exports = router;