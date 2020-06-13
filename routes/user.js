var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
var csrf = require('csurf');
var crypto = require('crypto');

/*prevent from csrf
csrf in wiki:https://zh.wikipedia.org/zh-tw/%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0*/
var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/error', function(req, res, next){
    res.render('user/error', {error: req.flash('error').toString()});
});

router.get('/signup', function(req, res, next){
  
    res.render('user/signup', {csrfToken: req.csrfToken(),
                               user: req.session.user,
                               success: req.flash('success').toString(),
                               error: req.flash('error').toString()});
  });
  
  router.post('/signup', function(req, res, next){
    var telephone = req.body.telephone;
    var email = req.body.email;
    var password = req.body.password;
    var salt = Math.floor(Math.random()*999);
    //推薦人的推薦碼
    var referralCode = req.body.refferalCode;
    //用戶的推薦碼(初始值)
    var myReferralCode;
    
    //產生一組推薦碼
    function makeCode(){
      var rd = Math.floor(Math.random()*999);
      var code = crypto.createHash('sha1').update(this.telephone + this.email + rd.toString()).digest('hex');
      console.log(code);
      return code.toString().substring(0, 10);
    }
    
    //確認產生無重複推薦碼
    myReferralCode = makeCode();
    //var pass = true;
    User.findOne({ refferalCode: myReferralCode }, function(err, user){
      if(err){
        console.error(err);
      }
      if(user){
        myReferralCode = makeCode();
        console.log('重複');
      }
      else{
         console.log('無重複');
      }
    });
  
    /*
    //確認推薦人是否存在
    query  = User.where({ refferalCode: referralCode });
    query.findOne(function(err, user){
      if(err) req.flash('error', '查無此推薦碼!');
      if(user){
        //推薦人的invitedFriend +1 (not yet)
        req.flash('4訊息唷', '推薦人存在!');
      }
    });
    */
  
    password = crypto.createHash('sha1').update(password + salt.toString()).digest('hex');
  
    User.findOne({'telephone': telephone}, function(err, user){
      if(err){
        console.log('查詢錯誤');
      }
      if(user){
        console.log('此號碼已使用');
      }
      //建立新user
      var newUser = new User({
        telephone: telephone,
        email: email,
        password: password,
        salt: salt,
        referralCode: myReferralCode,
        invitedFriend: 0
      });
  
      console.log(newUser);
      //將user存入db
      newUser.save(function(err, user){
        
        if(err){
          
          console.error(err);
          req.flash('error', '帳戶建立失敗!');
          res.redirect('/user/signup'); //not test yet
          
          //mongoose.disconnect();
          
        }
        
        console.log('saved!!');
        req.flash('success', '註冊成功!');
        res.redirect('/user/profile');
        //mongoose.disconnect();
        
          
        
      });
  
    });
  
  
  });
  
  router.get('/signin', function(req, res, next){
    res.render('user/signin', {csrfToken: req.csrfToken(),
                               user: req.session.user,
                               success: req.flash('success').toString(),
                               error: req.flash('err').toString()});
  });
  
  router.post('/signin', function(req, res, next){
    var telephone = req.body.telephone;
    var password = req.body.password;
  
    User.findOne({'telephone': telephone}, function(err, user){
      if(err){
        req.flash('error', '查詢錯誤');
        console.log('查詢錯誤');
      }
      if(user){
        console.log('找到用戶');
        var salt = user.salt;
        if(user.password === crypto.createHash('sha1').update(password + salt.toString()).digest('hex')){
          console.log('登入成功');
          //session存user資料
          req.session.user = user;
          req.flash('success', '登入成功');
          res.redirect('/user/profile');
        }
        else{
            console.log('登入失敗');
            req.session.user = null;
            req.flash('error', '登入失敗');
            res.redirect('/user/error');
        }
      }
      else{
        console.log('帳號或密碼錯誤');
      }
  
    });
  });

  router.get('/signout', isLoggedIn);
  router.get('/signout', function(req, res, next){
      console.log('登出成功');
      req.session.user = null;
      req.flash('success', '登出成功');
      res.redirect('/');
  });
  
  router.get('/profile', isLoggedIn);
  router.get('/profile', function(req, res, next){
    res.render('user/profile',{user: req.session.user,
                               success: req.flash('success').toString()});
                               //,error: req.flash('err').toString()});
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
