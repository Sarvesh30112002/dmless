const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// IMPORTANT for Vercel
const rootDir = path.join(__dirname, "..");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(rootDir, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views"));

// Routes
app.use(require("../routes/authRoutes"));
app.use(require("../routes/dashboardRoutes"));
app.use(require("../routes/jobRoutes"));
app.use(require("../routes/candidateRoutes"));
app.use(require("../routes/analyticsRoutes"));

// MongoDB Connection
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
}

// Home Route
app.get("/", (req, res) => {
  res.render("home");
});

module.exports = app;
