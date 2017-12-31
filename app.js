var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var passport = require('passport');

var config = require('./config');
var security = require('./backend/utils/security')


var app = express();

/***** Server set up *****/
app.use(express.static(config.server.fe_folder));


// view engine setup
app.set('views', path.join(__dirname, 'frontend'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');

app.use(session({ secret: config.server.session_secret }));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(config.server.fe_folder, 'images/dora_logo.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.server.session_secret));

// Initialize PassportJS
app.use(passport.initialize());
// Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request
app.use(passport.session());


security.initialize();


app.use(function(req, res, next) {
    var t="[" + new Date().toUTCString() + "]";
    if (req.user) {
        console.log(t, "- Current User:", req.user.user_name);
    } else {
        console.log(t, "- Unauthenticated");
    }
    next();
});

// Basic access api
app.post('/login', security.login);
app.post('/logout', security.logout);
app.get('/current_user', security.sendCurrentUser);

require('./backend/routes')(app, security);

// Handle unmatched api
app.get('/api/*', function(req, res) {
    res.status(400).json({ message: 'Bad request.' });
});

app.get('/*',function(req, res) {
    res.sendFile('index.html', { root: config.server.fe_folder, title: 'express' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
