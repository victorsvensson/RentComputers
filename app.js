const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const session = require("express-session");
const flash = require("connect-flash");

const { isLoggedIn } = require("./middleware");

const RentComputer = require("./models/rentcomputers");

//Routes
const usersRoutes = require("./routes/users");

//Connect to database
main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://localhost:27017/rentcomputers");
    console.log("Database is now connected");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(methodOverride("_method")); //used to PUT, normally you can just get and post
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true })); //Need to be used to be able to POST

const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//INIT Passport (Persistent login session, (not having to login all the time))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", usersRoutes);

app.get("/", (req, res) => {
    res.redirect("/RentComputers");
});

app.get("/RentComputers", isLoggedIn, async (req, res) => {
    const rentComputer = await RentComputer.find({});
    res.render("RentComputers/index", { rentComputer });
});

app.put("/RentComputers/:id/", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const user = await RentComputer.findByIdAndUpdate(id, {
        ...req.body.rentcomputers,
    });
    res.redirect("/RentComputers");
});

//New computer
app.get("/RentComputers/new", isLoggedIn, (req, res) => {
    res.render("RentComputers/new");
});

app.post("/RentComputers/new", isLoggedIn, async (req, res) => {
    const newComputer = new RentComputer(req.body);
    await newComputer.save();
    req.flash("success", "Successfully added a computer");
    res.redirect("/RentComputers");
});

//Delete page
app.get("/RentComputers/remove", isLoggedIn, async (req, res) => {
    const rentComputer = await RentComputer.find({});
    res.render("RentComputers/remove", { rentComputer });
});

app.delete("/RentComputers/remove/:id", isLoggedIn, async (req, res) => {
    await RentComputer.findByIdAndDelete(req.params.id);
    res.redirect("/RentComputers/remove");
});

app.get("/RentComputers/register", (req, res) => {
    res.render("/register");
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});
