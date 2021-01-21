let express = require("express");
let bodyParser = require("body-parser");


let app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);


    res.render('list', {today: day, newListItems: items});
});

app.post("/", (req, res) => {
    items.push(req.body.newItem);
    res.redirect("/");
})


app.listen(3000, () => console.log("server started on port 3000"));