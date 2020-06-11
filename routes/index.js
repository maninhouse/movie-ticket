var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var moment = require('moment');
var csrf = require('csurf');
//var passport = require('passport');
var crypto = require('crypto');

/*prevent from csrf
csrf in wiki:https://zh.wikipedia.org/zh-tw/%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0*/
var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  var movies = Movie.find(function(err, docs){
    movieList = []
    for (var i = 0; i < docs.length; i++){
      /*轉成object才不會Error
      ref:https://dev.to/abourass/how-to-solve-the-own-property-issue-in-handlebars-with-mongoose-2l7c
      */
      var doc = docs[i];
      /*doc.releaseDate = moment(doc.releaseDate, 'll');*/
      console.log(doc.releaseDate);
      movieList.push(doc.toObject());
    }
    res.render('shop/index', { title: 'Express', movies: movieList});  
  });
});

/*
router.get('/shop/buy', function(req, res, next){
  res.render('shop/buy');
});
router.get('/shop/detail', function(req, res, next){
  res.render('shop/detail');
});
*/


router.get('/user/signup', function(req, res, next){
  //what the fuxkkkkkkkkkkkkkkkkk
  var salt = Math.floor(Math.random()*999);
  Handlebars.registerHelper('encryptPwd', function(salt, pwd){
    return crypto.createHash('sha1').update(pwd + salt);
  });
  res.render('user/signup', {csrfToken: req.csrfToken(), salt: salt});
});

router.post('/user/signup', function(req, res, next){
  var telephone = req.body.telephone;
  var email = req.body.email;
  var password = req.body.password;
  var referralCode = refferalCode;
});

router.get('/user/profile', function(req, res, next){
  res.render('user/profile');
});



module.exports = router;
