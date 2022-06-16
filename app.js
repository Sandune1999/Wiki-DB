const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = new mongoose.model("Article", articleSchema);

//***********************ReEQUEST TARGETTING ALL ARTICLE********
app.route("/articles").get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Succesfully a new Article");
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Succesfully deleted all the articles");
      }
    });
  });


//***********************ReEQUEST TARGETTING ALL ARTICLE********

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No article is matching to requested title");
    }
  });
})

.put(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Succesfully updated article");
      }
      else{
        res.send(err);
      }
    }
  );
})

.patch(function(req,res){
  Article.update(
    {titile: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Succesfully updated article.");
      }
      else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(err){
        res.send(err);
      }else{
        res.send("Succesfully deleted selected article.");
      }
    }
  );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
