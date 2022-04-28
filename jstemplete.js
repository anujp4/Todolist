const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.get("/",function(req,res){
	res.send("anuj");
console.log("hello")});
app.listen(3000,function(){
console.log("running on 3000")});