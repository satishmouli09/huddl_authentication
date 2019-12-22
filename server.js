const express = require('express');
const app = express();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('./config/config');

const authRoutes = require('./routes/auth');
require('./services/passport');
const users = require('./services/users');
const cookieParser = require('cookie-parser');

const expressJwt = require('express-jwt');
const Jwt401Error = require('express-jwt').UnauthorizedError;

app.use(cookieParser());

app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
    getToken: req => req.cookies.HUDDL,
  }),
);

// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  console.log(err);
  console.log(req.cookies);
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.HUDDL);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('HUDDL');
    return res.redirect('/error')
  }
  next(err);
});

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // console.log("Email is", req.user.email);
    next();
  } else {
    res.redirect('/error?message=You have been logged out.');
  }
}

// View engine
app.set('view engine', 'ejs');

// set up routes
app.use('/auth', authRoutes);

// Home page
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('home', {loggedIn: req.isAuthenticated()});
   } else {
    res.render('welcome');
  }

});

// Home page
app.get('/home', isAuthenticated, (req, res) => {
  res.render('home', {loggedIn: req.isAuthenticated()});
});

// Error page
app.get('/error', (req, res) => {
  console.log(req.query.message);
  res.render('error', {message: req.query.message || "Something went wrong."});
});

// Get all users
app.get('/users', isAuthenticated, (req, res) => {
  return users.getAllUsers().then(users => {
    res.render('users', {loggedIn: req.isAuthenticated(), users: users, excludeUserEmail: req.user.email});
  });
});

// Handle Whitelisting and Blacklisting users.
app.get('/whitelist', isAuthenticated, (req, res) => {
  let id = req.query.id;
  let status = (req.query.type === "whitelist");
  return users.updateWhitelist(id, status).then(() => {
    res.redirect('/users');
  });
});

//TODO Get port from env variable
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`The server is running at http://localhost:${port}/`);
});
