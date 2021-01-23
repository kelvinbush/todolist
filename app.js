const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");


const app = express();


//connect ot db
mongoose.connect("mongodb://localhost:27027/todolistDB", {useUnifiedTopology: true, useNewUrlParser: true});

//create item schema
const itemSchema = {
    name: String
};


const Item = mongoose.model("item", itemSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use('*/css', express.static('public/css'));

app.get("/", (req, res) => {

    res.render('list', {listTitle: date.getDate(), newListItems: items});
});

app.post("/", (req, res) => {
    console.log(req.body);
    const item = req.body.newItem;
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/work", (req, res) => {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/work", (req, res) => {
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});


app.listen(3000, () => console.log("server started on port 3000"));