const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success");
            res.redirect("/");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/register");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    (req, res) => {
        req.flash("success", "welcome back!");
        res.redirect("/RentComputers");
    }
);

router.post("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have successfully logged out!");
        res.redirect("/login");
    });
});

module.exports = router;
