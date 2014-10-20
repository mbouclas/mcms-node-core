module.exports = (function(App,options){
    var lodash = require('lodash');
    var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;


    options = lodash.merge({
        loginUrl : '/login',
        successRedirect : '/',
        failureRedirect : '/login'
    },options);

    var handler = options.handlers;

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        handler.findById(id,function(err,user){
             done(err,user);
         });
    });

    var credentials = {
        usernameField: App.Config.auth.credentials.usernameField,
        passwordField: App.Config.auth.credentials.passwordField
    };

    passport.use(
        new LocalStrategy(credentials,
        function(username, password, done) {
            var lookUp = {};

            lookUp[App.Config.auth.credentials.usernameField] = username;
            lookUp[App.Config.auth.credentials.passwordField] = password;//need to encrypt it first

            handler.findByCredentials(lookUp,function(err,user){
                return done(null, user);
            });
        }
    ));

    passport.manualLogin = function(username,password,callback){
        passport.authenticate('local',function(err, user, info) {

            if (err) { return callback(err) }
            if (!user) {
                return 'no user';
            }

            callback(null,user);
        })({body : {username:username,password:password}});
    };

    passport.authMiddleware = function(settings){
        settings = lodash.merge(options,settings);

        return passport.authenticate('local',{
            successRedirect: settings.successRedirect,
            failureRedirect: settings.failureRedirect
        });
    }
/*    passport.authMiddleware = function(settings){
        settings = lodash.merge(options,settings);
        return passport.authenticate('local',{
            successRedirect: settings.successRedirect,
            failureRedirect: settings.failureRedirect
        });
    }*/

    passport.isAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect(options.loginUrl);
    };

    App.server.use(passport.initialize());
    App.server.use(passport.session());
    return passport;
});