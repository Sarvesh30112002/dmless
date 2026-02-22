const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

const authRoutes = require("../routes/authRoutes");
app.use(authRoutes);

const dashboardRoutes = require("../routes/dashboardRoutes");
app.use(dashboardRoutes);

const jobRoutes = require("../routes/jobRoutes");
app.use(jobRoutes);

const candidateRoutes = require("../routes/candidateRoutes"); 
app.use(candidateRoutes);

const analyticsRoutes = require("../routes/analyticsRoutes");
app.use(analyticsRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.render("home");
});

// For Vercel
module.exports = app;

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
}