var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const format = require('string-format');
const compression = require('compression');
require('colors');

/**
 * Replace all chars
 * @param search
 * @param replacement
 * @returns {string}
 */
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Powered by and content type
app.use(function (req, res, next) {
    res.set('X-Powered-By', 'WebCache');
    res.set('Content-Type', 'text/plain');
    next();
});

app.use(compression());   // gzip
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.log(format('[!] Error: {}', err.message || err).bold.red);
    res.status(err.status || 400);
    res.send({error: err.message || err})
});

module.exports = app;
