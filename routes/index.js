var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var Cart = require('../models/cart');
var Order = require('../models/order');

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
    movieList = [];
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

router.get('/shop/detail/:id', function(req, res, next){

  var movieId = req.params.id;
  
  Movie.findById(movieId, function (err, movie) {
    if(err){
      res.redirect('/');
    }
    
    res.render('shop/detail', {movie: movie.toObject()});
  });
  
});

router.get('/addTOCart/:id', function (req, res, next) {
  var movieId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  
  Movie.findById(movieId, function (err, movie) {
    if(err){
      res.redirect('/');
    }
    cart.add(movie, movie.id);
    req.session.cart = cart;
    console.log('Add To Cart:');
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/reduce/:id', isLoggedIn);
router.get('/reduce/:id', function(req, res, next) {
  var movieId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(movieId);
  req.session.cart = cart;
  res.redirect('/shoppingcart');
});

router.get('/remove/:id', isLoggedIn);
router.get('/remove/:id', function(req, res, next) {
  var movieId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(movieId);
  req.session.cart = cart;
  res.redirect('/shoppingcart');
});

router.get('/shoppingcart', isLoggedIn);
router.get('/shoppingcart', function (req, res, next) {
  //console.log(req.session.cart);
  if (!req.session.cart) {
      
      req.session.cart = new Cart({});
      cart = req.session.cart;
      res.render('shop/shoppingcart', {items: cart});
  }
  
      var cart = new Cart(req.session.cart);
      res.render('shop/shoppingcart', {items: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn);
router.get('/checkout', function(req, res, next){
  if (!req.session.cart) {
    res.redirect('/shoppingcart');
  }
  var cart = new Cart(req.session.cart);
  var paymentId = Math.floor(Math.random()*99999).toString();
  
  var order = new Order({
    user: req.session.user,
    cart: cart,
    paymentId: paymentId
  });

  order.save(function(err, order){
    if(err){
      req.flash('error', err.message);
      res.redirect('/error');
    }
    req.flash('success', '購買成功');
    req.session.cart = null;
    res.render('shop/checkout', {orderId: order._id});
  });

});


module.exports = router;

function isLoggedIn(req, res, next){
  if(!req.session.user){
      req.flash('error', '尚未登入');
      /*if using redirect, don't need to call next(),
       or error happens "Cannot set headers after they are sent to the client"*/
      res.redirect('/user/error');
  }
  else{
      req.flash('success', '已登入');
      //res.redirect('back');
      next();
  }
  
}