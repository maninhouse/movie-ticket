var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
//var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();

//connect to db 'movie' from mongodb
mongoose.connect('mongodb://localhost:27017/movie', {useNewUrlParser:true, useUnifiedTopology:true})
    .then(() => console.log('MongoDB:movie Connected...'))
    .catch((err) => console.log(err));


    
//改用原本的方法，不用passport
// import passport.js I wrote
//require('./config/passport');

// view engine setup
// default:app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {maxAge: 24 * 60 * 60 * 1000} //one day
}));
app.use(flash());
// the configuration applied here will be available in the other file.(passport)
//app.use(passport.initialize());
//app.use(passport.session()); // should be after app.use(sesseion(...))
app.use(express.static(path.join(__dirname, 'public')));

/*  maybe will need to use
app.use(function(req, res, next){
  res.locals.session = req.session;
});
*/

app.use('/user', userRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
