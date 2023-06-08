var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users'); // Rota criado pelo express-generator desativada
var signUpRouter = require('./routes/api/signUp');
var signInRouter = require('./routes/api/signIn');
var protectedRouter = require('./routes/protected');
var classifiedRouter = require('./routes/classified');
var installRouter = require('./routes/api/install');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter); // Rota criado pelo express-generator desativada
app.use('/api/signUp', signUpRouter);
app.use('/api/signIn', signInRouter);
app.use('/protected', protectedRouter);
app.use('/classified', classifiedRouter);
app.use('/api/install', installRouter);

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
