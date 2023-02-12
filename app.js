
const express = require("express");
const app = express();
const path = require("path");
const mssql = require("mssql");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const config = require('./dbconfig');

// Connect to the Microsoft SQL database
main().catch((err) => console.log(err));

async function main() {
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

app.get("/", (req, res) => {
    res.redirect("/RentComputers");
});

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
});

