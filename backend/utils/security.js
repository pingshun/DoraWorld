
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dwUser = require('./../models/dw_user');

var filterUser = function(user) {
    if (user) {
        return {
            user : {
                id: user.id,
                email: user.email,
                user_name: user.user_name,
                role: user.role,
/*                status: user.status,
                photo: user.photo*/
            }
        };
    } else {
        return { user: null };
    }
};



var security = {
    initialize: function() {
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
        passport.deserializeUser(function(id, done) {
            dwUser.getById(id, function (err, result) {
                done(err, result);
            });
        });
        passport.use(new LocalStrategy(
            function(username, password, done) {
                dwUser.getsByFields({user_name: username}, function (err, result) {
                    if (err) {
                        console.log(err.message);
                        return done(err);
                    }
                    if (!result || result.length < 1) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    if (result[0].password !== password) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    return done(null, result[0]);
                });
            }
        ));
    },
    authenticationRequired: function(req, res, next) {
        if (req.isAuthenticated()) {
            next(req, res);
        } else {
            res.status(401).json(filterUser(req.user));
        }
    },
    adminRequired: function(req, res, next) {
        if (req.user && req.user.role === 1) {
            next();
        } else {
            res.status(401).json(filterUser(req.user));
        }
    },
    sendCurrentUser: function(req, res, next) {
        if(req.user) {
            res.status(200).json(filterUser(req.user));
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    },
    login: function(req, res, next) {
        return passport.authenticate('local', function(err, user, info) {
            if(err) {
                res.status(500).json(err);
            } else if(!user) {
                res.status(404).json({ message: 'User not found.' });
            } else {
                req.logIn(user, function(err) {
                    if(err) {
                        console.log('asdf');
                        res.status(500).json(err);
                    } else {
                        res.status(200).json(filterUser(user));
                    }
                });
            }
        })(req, res, next);
    },
    logout: function(req, res, next) {
        req.logout();
        res.status(200).json({ message: 'User signed out.' });
    }
};

module.exports = security;