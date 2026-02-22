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

// Routes
app.use(require("../routes/authRoutes"));
app.use(require("../routes/dashboardRoutes"));
app.use(require("../routes/jobRoutes"));
app.use(require("../routes/candidateRoutes"));
app.use(require("../routes/analyticsRoutes"));

// MongoDB Connection (IMPORTANT: prevent multiple connections)
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGO_URI);
}

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

// Export for Vercel
module.exports = app;
