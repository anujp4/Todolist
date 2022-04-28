//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
const itemSchema={
  name : String
};
const Item = mongoose.model("Item",itemSchema);
const item1= new Item({
  name:"Welcome to your Todolist"
});
const item2 = new Item({
  name:"Hit  the + button to add a item."
});
const item3= new Item({
  name:"<-- to delete a item."
});
const defualtItems = [item1,item2,item3];
const listSchema = {
  name:String,
  items:[itemSchema]
};
const List = mongoose.model("List",listSchema);
/*Item.insertMany(defualtItems,function(err){
 if (err){
 console.log("error");
}else {
  console.log("sucessfully logged");
}
});*/

app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defualtItems,function(err){
       if (err){
       console.log("error");
      }else {
        console.log("sucessfully logged");
      }
      });
      res.redirect("/")
    }else{
        res.render("list", {listTitle: "Today", newListItems: foundItems});
}
});

});
app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);
  List.findOne({name:customListName},function(err,foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name:customListName,
          items:defualtItems
        });
          list.save();
          res.redirect("/"+customListName);
      }else{
      res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
      }
    }
  });


});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });
  if (listName==="Today"){
  item.save();
  res.redirect("/");
}else{
  List.findOne({name:listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName);
  })
}
});
app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("sucessfully deleted");
        res.redirect("/");
}
});
}else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
    if(!err){
      res.redirect("/"+listName);

    }
  });
}
});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
