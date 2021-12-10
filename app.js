//Importing modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

let formatNumber = (number) => {
    num = "" + number;
    let formattedNum = "";
    let cnt = 0;
    for (let i = num.length - 1; i >= 0; i--) {
        formattedNum = num[i] + formattedNum;
        cnt = cnt + 1;
        if (cnt % 3 === 0 && i > 0) formattedNum = "," + formattedNum;
    }
    return formattedNum;
};

//Building the app
const app = express();
//Settin the port
const port = process.env.PORT || 3000;

//Using 1 JSON file as database
let dbQuotes = JSON.parse(fs.readFileSync("data.json"));

//Using 1 txt file as 'klik' database
let counterKlik = parseInt(fs.readFileSync("dataKlik.txt"));

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
    let formattedNumber = formatNumber(counterKlik);
    res.render("index", {
        title: "ini halaman utama",
        db: dbQuotes,
        counterK: formattedNumber,
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

app.post("/klik", (req, res) => {
    counterKlik++;
    fs.writeFileSync("dataKlik.txt", "" + counterKlik);
    res.redirect("/#profile");
});

//Handling invalid request
app.use((req, res, next) => {
    res.status(404);
    res.send("<h1>x_x ga ada pagenya</h1>");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
