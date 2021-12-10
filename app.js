//Importing modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

//Configuring the app
const app = express();
//Settin the port
const port = process.env.PORT || 3000;

//Using 1 JSON file as database
let dbQuotes = JSON.parse(fs.readFileSync("data.json"));

//Using ejs as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Using bodyParser to parse data from HTML form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//Make a public directory
app.use(express.static("public"));

//Handling get method for '/'
app.get("/", (req, res) => {
    res.render("index", {
        title: "ini halaman utama",
        db: dbQuotes,
    });
});

//Handling post method for '/addquote'
app.post("/addquote", (req, res) => {
    dbQuotes.push({
        nama: req.body.nama,
        quote: req.body.quote,
    });
    fs.writeFileSync("data.json", JSON.stringify(dbQuotes, null, 4));
    res.redirect("/#quotes");
});

//Handling invalid request
app.use((req, res) => {
    res.status(404);
    res.send("<h1>x_x ga ada pagenya</h1>");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
