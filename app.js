//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// set up mongodb****************************************************************
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true })

// to define what you have
const articleSchema={
  title:String,
  content:String
};

// to create List
const Article=mongoose.model('Article',articleSchema);

// modelName is 'Article'
// collection name is 'articles'
//read------------------ROUTE METHOD(ALL ARTICLES)------------------------------------------------
app.route('/articles')

.get((req,res)=>{
  // to read articles
  Article.find((err,foundArticles)=>{
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
    
  });
})

.post((req,res)=>{
  
  const newArticle= new Article({
    title:req.body.title,
    content:req.body.content
  });
  
    newArticle.save((err)=>{
      if(!err){
        res.send('added new article')
      }else{
        res.send(err)
      }
    });
  
  })
  
  .delete((req,res)=>{

    Article.deleteMany((err)=>{
      if(!err){
        res.send('deleted all')
      }else{
        res.send(err);
      }
    })
  })
  // ------------------SPECIFIC ARTICLES-----------------------

  // localhost:3030/articles/jack
  // req.params.articleTitle=>'jack'

  app.route('/articles/:articleTitle')

  .get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send('no articles matching that title was found')
      }
    });
  })

  .put((req,res)=>{
    Article.update(
      // conditon
      {title:req.params.articleTitle},
      // updating part
      {title:req.body.title, content:req.body.content},
      // update method
      {overwrite:true},(err)=>{
        if(!err){
          res.send('updated success!!')
        }
      }
      );
  })

  .patch((req,res)=>{
    Article.update(
      // conditions
      {title:req.params.articleTitle},
      // updating part
      {$set:req.body},(err)=>{
        if(!err){
          res.send('susccessfully updated')
        }else{
          res.send(err)
        }
      })
  })

  .delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle},(err)=>{
      if(!err){
        res.send('successfully deleted just one article!')
      }else{
        res.send(err);
      }
    })
  });

// --------------------------------------------------------------
// app.get("/articles",(req,res)=>{
//   // to read articles
//   Article.find((err,foundArticles)=>{
//     if(!err){
//       res.send(foundArticles);
//     }else{
//       res.send(err);
//     }
    
//   });
// });
// // create***********************************************************
// app.post('/articles',(req,res)=>{
  
// const newArticle= new Article({
//   title:req.body.title,
//   content:req.body.content
// });

//   newArticle.save((err)=>{
//     if(!err){
//       res.send('added new article')
//     }else{
//       res.send(err)
//     }
//   });

// });
// // delete*****************************************************
// app.delete('/articles',(req,res)=>{

//   Article.deleteMany((err)=>{
//     if(!err){
//       res.send('deleted all')
//     }else{
//       res.send(err);
//     }
//   })
// });

// ************************************************************
app.listen(3030, function() {
  console.log("Server started on port 3030");
});
