const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../../client/models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for the google strat
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        //console.log(profile);

        // check if user already exists in our db
        User.findOne({oauth_id: profile.id}).then((currentUser) => {
            if (currentUser) {
                // already have the user
                console.log("user is: " + currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    oauth_id: profile.id,
                    finishedQuestions: [],
                    savedQuestions: []
                }).save().then((newUser) => {
                    console.log("new user created: " + newUser);
                    done(null, newUser);
                });
            }
        });
    })
);