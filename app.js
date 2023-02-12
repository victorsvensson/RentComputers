
const express = require("express");
const app = express();
const path = require("path");
const mssql = require("mssql");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const session = require("express-session");
const flash = require("connect-flash");

const { isLoggedIn } = require("./middleware");

<<<<<<< HEAD
// Connect to the Microsoft SQL database
=======
const RentComputer = require("./models/rentcomputers");

//Routes
const usersRoutes = require("./routes/users");

//Connect to database
>>>>>>> 526d0f76f0df65d410e8915f13e282ad867e5ddf
main().catch((err) => console.log(err));

async function main() {
    const config = {
        user: "sa",
        password: "Testsson123!",
        server: "PC970601",
        database: "RentalComputers",
        trustServerCertificate: true,
        port: 64574

    };

    try {
        await mssql.connect(config);
        console.log("Database is now connected");
    } catch (err) {
        console.error("Error connecting to the database: ", err);
    }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));

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

<<<<<<< HEAD
app.get("/RentComputers", async (req, res) => {
    const request = new mssql.Request();
    const result = await request.query("SELECT * FROM dbo.computers");

    const rentComputer = result.recordset;
    res.render("RentComputers/index", { rentComputer });
});

app.put("/RentComputers/:id/", async (req, res) => {
    const request = new mssql.Request();
    const id = req.params.id;
    
    const { name, errandNumber, status } = req.body;
    console.log(req.body);

    const query = `UPDATE dbo.computers SET name='${name}', errandNumber=${errandNumber}, status=${status} WHERE inventoryID=${id}`;

    await request.query(query);
    res.redirect("/RentComputers");
});

app.get("/RentComputers/new", (req, res) => {
    res.render("RentComputers/new");
});

app.post("/RentComputers/new", async (req, res) => {
    const request = new mssql.Request();
    const { inventoryID, year } = req.body;

    const query = `INSERT INTO dbo.computers (inventoryID, year, status) 
    VALUES ('${inventoryID}', '${year}', 0)`;

    await request.query(query);
    res.redirect("/");
});

//Delete page
app.get("/RentComputers/remove", async (req, res) => {

  const request = new mssql.Request();
  const result = await request.query("SELECT * FROM dbo.computers");

  const rentComputer = result.recordset;
  res.render("RentComputers/remove", { rentComputer });
});

app.delete("/RentComputers/remove/:id", async (req, res) => {
    //await RentComputer.findByIdAndDelete(req.params.id);
    const id = req.params.id;
    console.log(id);
    const request = new mssql.Request();
    const result = await request.query(`DELETE FROM dbo.computers WHERE inventoryID=${id}`);
  console.log(result);
    const rentComputer = result.recordset;

    res.redirect("/RentComputers/remove");
});

var server = app.listen(5000, function () {
  console.log('Server is running..');
=======
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
>>>>>>> 526d0f76f0df65d410e8915f13e282ad867e5ddf
});

