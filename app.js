const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: {type: String},
  content: {type: String}
});

const Article  = mongoose.model("Article", articleSchema);

//reqst all articles
app.route("/articles")

.get(function(req, res){
  Article.find({},function(err, foundArticles){
      if(!err){
        res.send(foundArticles);
      }else{
        res.send(err);
      }


  });
})

.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted");
    }else{
      res.send(err);
    }
  })
});




//request for specific route
app.route("/articles/:articleTitle")
.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No article found");
    }

});

})

.put(function(req, res){
  Article.update({
    title: req.params.articleTitle},
  {title: req.params.articleTitle, content: req.body.content},

{overwrite: true},
function(err){
  if(!err){
    res.send("Success");
  }else{
    res.send(err);
  }
}
);
}
)
.patch(function(req, res){
  Article.update({title: req.params.articleTitle},
  {
    $set: req.body
  },function(err){
    if(!err){
      res.send("Success");
    }else{
      res.send(err);
    }
  })
})
.delete(function(req, res){
  Article.deleteOne({
    title: req.params.articleTitle
  },function(err){
    if(!err){
      res.send("Success");
    }else{
      res.send(err);
    }
  })
})


app.listen("3000", function(){
  console.log("Server running at port 3ooo");
} )
