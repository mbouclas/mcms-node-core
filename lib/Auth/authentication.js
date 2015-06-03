module.exports = (function(App){
    var passport = require('passport'),
        middleware = require('./middleware')(App),
        flash = require('connect-flash'),
        csrf = require('csurf'),
        Auth = {
            loginStrategies : [],
            middleware : middleware,
            passport : passport
        },
        User = App.User;

    Auth.initialize = function(app) {

        app.use(passport.initialize());
        app.use(passport.session());
        Auth.middleware = middleware;
    };

    Auth.getLoginStrategies = function() {
        return this.loginStrategies;
    };

    require('./localStrategy')(App,Auth,passport,User);
    require('./facebookStrategy')(App,Auth,passport,User);
    require('./googleStrategy')(App,Auth,passport,User);

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(uid, done) {
        done(null, {
            uid: uid
        });
    });

    return Auth;
});