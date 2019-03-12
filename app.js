var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const format = require('string-format');
require('colors');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(format('[!] Error: {}', err.message || err).bold.red);
  res.status(err.status || 400);
  res.send({error: err.message || err})
});

module.exports = app;
