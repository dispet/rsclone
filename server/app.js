const createError = require('http-errors');
const express = require('express');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const pageRouter = require('./routes/pageRouter')
const Router = require('./api/index')

const app = express();

const session = require('express-session');

const FileStore = require('session-file-store')(session);

app.use(session({
  secret: 'j098 song1234',  // encryption
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(pageRouter);
app.use(Router);

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
