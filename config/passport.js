// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

User.findOne({ 'local.username' :  'Guest' }, function(err, user){
    if (err)
        return done(err);
    if(!user){
        var newUser = new User();
        newUser.local.username = 'Guest';
        newUser.local.password = newUser.generateHash('nashville');
        newUser.local.admin = false;
        newUser.save(function(err) {
        if (err)
            throw err;
        });
    }
});
User.findOne({ 'local.username' :  'Admin' }, function(err, user){
    if (err)
        return done(err);
    if(!user){
        var newUser = new User();
        newUser.local.username = 'Admin';
        newUser.local.password = newUser.generateHash('General Jackson');
        newUser.local.admin = true;
        newUser.save(function(err) {
        if (err)
            throw err;
        });
    }
});

// expose this function to our app using module.exports
module.exports = function(passport) {

    // Session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'local.username' :  username }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser            = new User();

                        // set the user's local credentials
                        newUser.local.username    = username;
                        newUser.local.password    = newUser.generateHash(password);
                        newUser.local.admin       = false;

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            if(username != 'Admin'){
                username = 'Guest';
            }
            User.findOne({ 'local.username' :  username }, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                return done(null, user);
            });

        }));


};
