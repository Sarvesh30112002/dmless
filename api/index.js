const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

/* -----------------------------
   MONGODB CONNECTION (SAFE)
------------------------------ */

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB Error:", err);
  }
};

connectDB();

/* -----------------------------
   MIDDLEWARE
------------------------------ */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public")));

/* -----------------------------
   VIEW ENGINE
------------------------------ */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

/* -----------------------------
   ROUTES
------------------------------ */

app.use(require("../routes/authRoutes"));
app.use(require("../routes/dashboardRoutes"));
app.use(require("../routes/jobRoutes"));
app.use(require("../routes/candidateRoutes"));
app.use(require("../routes/analyticsRoutes"));

/* -----------------------------
   HOME
------------------------------ */

app.get("/", (req, res) => {
  res.render("home");
});

/* -----------------------------
   EXPORT FOR VERCEL
------------------------------ */

module.exports = app;

/* -----------------------------
   LOCAL DEVELOPMENT ONLY
------------------------------ */

if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
