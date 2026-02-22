const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.resolve("./public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


// Routes
app.use(require("../routes/authRoutes"));
app.use(require("../routes/dashboardRoutes"));
app.use(require("../routes/jobRoutes"));
app.use(require("../routes/candidateRoutes"));
app.use(require("../routes/analyticsRoutes"));

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const db = await mongoose.connect(process.env.MONGO_URI);
  isConnected = db.connections[0].readyState;
};

connectDB();

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

// Export for Vercel
module.exports = app;
