const router = require('express').Router();
const passport = require('passport');
const uuid = require('node-uuid');
const jwt = require('jsonwebtoken');

// auth login
router.get('/login', (req, res) => {
  res.render('login');
});

// google auth
router.get('/google', passport.authenticate('google', {
    scope: [
      'email',
      'profile'
    ]
  })
);

// callback route for google to redirect to
router.get('/google/callback',
  passport.authenticate('google', {failureRedirect: '/error?message=User Not Whitelisted.', session: true}), (req, res) => {
  // authService.signToken(req, res);
  const expiresIn = 60 * 60 ; // 1 minute
  let userData = Object.assign({}, req.user);
  delete userData.token;
  userData.csrf = uuid.v4().replace(/-/g, '');
  const token = jwt.sign(userData, process.env.JWT_SECRET, {expiresIn});
  res.cookie('HUDDL', token, {maxAge: 1000 * expiresIn, httpOnly: true});
  //TODO change this
  res.redirect('/home');
},
function (err, req, res, next) {
  console.log(err);
  res.redirect('/error');
});

// logout
router.get('/logout', (req, res) => {
   // TODO Handle with passport
  res.cookie('HUDDL', "", {maxAge: 0, httpOnly: true});
  res.redirect('/');
});

module.exports = router;