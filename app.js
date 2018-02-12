var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");

mongoose.connect("mongodb://admin:admin@ds229388.mlab.com:29388/blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MODEL CONFIG

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    content: String
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX ROUTE

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW ROUTE

app.get("/blogs/new", function(req, res) {
    res.render("new"); 
});

// CREATE ROUTE

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            console.log(err);
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            console.log(err);
        } else {
            res.render("edit", {blog: foundBlog});
        }
    }); 
});

// UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
    req.body.blog.content = req.sanitize(req.body.blog.content);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          console.log(err);
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
       } else {
           res.redirect("/blogs");
       }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
})