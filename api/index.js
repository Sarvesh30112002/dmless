const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.resolve("./public")));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes
app.use(require("../routes/authRoutes"));
app.use(require("../routes/dashboardRoutes"));
app.use(require("../routes/jobRoutes"));
app.use(require("../routes/candidateRoutes"));
app.use(require("../routes/analyticsRoutes"));

// Mongo
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

connectDB();

app.get("/", (req, res) => {
  res.render("home");
});

module.exports = app;
