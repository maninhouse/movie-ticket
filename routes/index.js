var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');

//var mongoose = require('mongoose');
//var moment = require('moment');
//var csrf = require('csurf');
//var passport = require('passport');
//var crypto = require('crypto');



/*
有空再作的部分:
    show error (ex: email is used.)
*/

/* GET home page. */
router.get('/', function(req, res, next) {
  var movies = Movie.find(function(err, docs){
    movieList = []
    for (var i = 0; i < docs.length; i++){
      /*轉成object才不會Error
      ref:https://dev.to/abourass/how-to-solve-the-own-property-issue-in-handlebars-with-mongoose-2l7c
      */
      var doc = docs[i];
      // for test:console.log(doc.releaseDate);
      movieList.push(doc.toObject());
    }
    res.render('shop/index', { title: '草莓影城訂票系統', movies: movieList,
                               user: req.session.user,
                               success: req.flash('success').toString(),
                               error: req.flash('err').toString()});  
  });
});

/*
router.get('/shop/detail', function(req, res, next){
  res.render('shop/detail');
});
*/



module.exports = router;
