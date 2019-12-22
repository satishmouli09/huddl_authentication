const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const User = require('../models/user');


//TODO Get credentials from env variables
const google = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
};

passport.use(new GoogleStrategy(google, (req, accessToken, refreshToken, profile, done) => {
    return User.findOne({email: profile._json.email}).then(currentUser => {
      if (currentUser) {  // Checking if user already exists
        if (currentUser.whitelisted) {
          if (!currentUser.loginId) { // If complete user data is not present, add the data to db
            return User.findById(currentUser.id, (err, user) => {
              if (!err) {
                user.username = profile.displayName;
                user.loginId = profile.id;
                user.data = profile._json;
                user.save(err => {
                  if (!err) {
                    return done(null, {
                      id: profile.id,
                      email: profile._json.email,
                      name: profile.displayName,
                      picture: profile.photos[0].value
                    });
                  }
                })
              }
            })
          } else { //If complete user data is present, do nothing
            return done(null, {
              id: profile.id,
              email: profile._json.email,
              name: profile.displayName,
              picture: profile.photos[0].value
            });
          }
        } else { //If user is not whitelisted, throw error
          return done(null, null, {message: "User not Whitelisted."})
        }
      } else { // If no user is present, add the email to db, mark whitelisted as false and return Unauthorized
        return new User({
          email: profile._json.email,
          whitelisted: false,
        }).save().then(() => {
          return done(null, null, {message: ""})
        })
      }
    });
  })
);