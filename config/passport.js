/* 沒用到
var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null, user.id); 
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'telephone',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, telephone,  password, done){
    User.findOne({'telephone': telephone}, function(err, user){
        if (err){
            return done(err);
        }
        if (user) {
            return done(null, false, {message: '此號碼已使用。'});
        }
        var newUser = new User();
        newUser.telephone = telephone;
        
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if (err){
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));
*/