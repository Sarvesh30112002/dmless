const express = require("express");
const bcrypt = require("bcryptjs");
const Recruiter = require("../models/Recruiter");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* ---------- LOGIN PAGE ---------- */
router.get("/login", (req, res) => {
  res.render("login");
});

/* ---------- SIGNUP PAGE ---------- */
router.get("/signup", (req, res) => {
  res.render("signup");
});


/*
POST - signup recruiter
*/
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // basic validation
        if (!name || !email || !password) {
            return res.render("signup", {
                error: "All fields are required"
            });
        }

        router.post("/login", async (req, res) => {
            try {
                const { email, password } = req.body || {};

                if (!email || !password) {
                    return res.render("login", { error: "All fields required" });
                }

                const recruiter = await Recruiter.findOne({ email });

                if (!recruiter) {
                    return res.render("login", { error: "Invalid email or password" });
                }

                const isMatch = await bcrypt.compare(password, recruiter.password);

                if (!isMatch) {
                    return res.render("login", { error: "Invalid email or password" });
                }

                const token = jwt.sign(
                    { id: recruiter._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );

                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "lax"
                });

                res.redirect("/dashboard");

            } catch (error) {
                console.log(error);
                res.render("login", { error: "Something went wrong" });
            }
        });

        // check existing recruiter
        const existing = await Recruiter.findOne({ email });

        if (existing) {
            return res.render("signup", {
                error: "Email already registered"
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const recruiter = new Recruiter({
            name,
            email,
            password: hashedPassword
        });

        await recruiter.save();

        // redirect to login (we create login in next chunk)
        res.redirect("/login");

    } catch (error) {
        console.log(error);
        res.render("signup", {
            error: "Something went wrong"
        });
    }
});

module.exports = router;