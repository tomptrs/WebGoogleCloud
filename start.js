var express = require("express");

var app = express();

app.get("/",function(req,res){
	res.send(200,"Hallo Tom");
});


app.listen(8080);