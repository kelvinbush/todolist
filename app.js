const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");
const _ = require("lodash");


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use('*/css', express.static('public/css'));


//connect to db
mongoose.connect("mongodb+srv://admin-kelvin:test123@cluster0.iinbt.mongodb.net/todolistDB?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

//create item schema
const itemSchema = {
    name: String
};


const Item = mongoose.model("item", itemSchema);

const item1 = new Item({
    name: "Welcome to your to do list"
});

const item2 = new Item({
    name: "Hit the + button to add new item"
});

const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];
const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema);


app.get("/", (req, res) => {
    Item.find({}, (err, items) => {
        if (items.length === 0) {
            Item.insertMany(defaultItems, err => {
                if (err) console.log(err);
                else console.log("Success");
            });
            res.redirect("/");
        } else {
            res.render('list', {listTitle: "Today", newListItems: items});
        }

    })


});

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}, (err, list) => {
            if (!err) {
                if (!list) {
                    //create new list
                    const list = new List({
                        name: customListName,
                        items: defaultItems
                    });
                    list.save();
                    res.redirect("/" + customListName);
                } else {
                    //show an existing list
                    res.render('list', {listTitle: customListName, newListItems: list.items});
                }
            }
        }
    );

})

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const nItem = Item({
        name: itemName
    });
    if (listName === "Today") {
        nItem.save();
        res.redirect('/');
    } else {
        List.findOne({name: listName}, (err, list) => {
            if (!err) {
                list.items.push(nItem);
                list.save();
                res.redirect("/" + listName);
            }
        })
    }

});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, err => {
            if (err) console.log(err);
            else console.log("Successfully deleted!");
        });
        res.redirect('/');
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, list) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
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

let port = process.env.PORT;
if(port == null || port === ""){
    port = 3000;
}

app.listen(port, () => console.log("server started Successfully"));