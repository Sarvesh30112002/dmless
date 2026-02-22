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

// Static
app.use(express.static(path.join(__dirname, "../public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Routes
app.use(require("../routes/authRoutes"));
app.use(require("../routes/dashboardRoutes"));
app.use(require("../routes/jobRoutes"));
app.use(require("../routes/candidateRoutes"));
app.use(require("../routes/analyticsRoutes"));

// Mongo connection (IMPORTANT FIX)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const db = await mongoose.connect(process.env.MONGO_URI);
  isConnected = db.connections[0].readyState === 1;
  console.log("MongoDB Connected");
}

// Root route
app.get("/", async (req, res) => {
  await connectDB();
  res.render("home");
});

// Ensure DB connects before any request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Export for Vercel
module.exports = app;

// Local only
if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
}
