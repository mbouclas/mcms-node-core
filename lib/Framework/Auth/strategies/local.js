module.exports = (function(App,userModel,passport,options){
    var lodash = require('lodash');
    var localStrategy = require('passport-local').Strategy;
    var cf = require('../../common'),
        commonFunctions = new cf();

    options = lodash.merge({
        loginUrl : '/login',
        successRedirect : '/',
        failureRedirect : '/login',
        passReqToCallback : true,
        failureFlash: true
    },options);

    var handler = options.handlers;
    var settings = {
        passReqToCallback : true,
        failureFlash: true,
        usernameField: App.Config.auth.credentials.usernameField,
        passwordField: App.Config.auth.credentials.passwordField
    };
    passport.use('local', new localStrategy(settings,
        function(req,username, password, done) {
            var lookUp = {};
            lookUp[App.Config.auth.credentials.usernameField] = username;
            //lookUp[App.Config.auth.credentials.passwordField] = password;//need to encrypt it first

            handler.findByCredentials(lookUp,function(err,user){

                if (err) {
                    console.log('err : ',err)
                    return done(err)
                }

                if (!user) {
                    req.flash('messageError', 'userNotFound');
                    return done(null, false);
                    //return done(null, false, req.flash('message', 'Unknown user ' + username));
                }

                if (typeof App.Config.auth.credentials.activeField != 'undefined'){
                    if (!user[App.Config.auth.credentials.activeField]){
                        req.flash('messageError', 'userNotActive');
                        return done(null, false);
                    }
                }

                if (!App.Crypt.check(password,user.password)) {
                    req.flash('messageError', 'passwordMissmatch');
                    return done(null, false);
                }



                var expires;

                if (req.body[App.Config.auth.credentials.rememberMeField]) {
                    expires = new Date(Date.now() + (commonFunctions.calculateExpiry(App.Config.auth.rememberMeTTL)));
                } else {
                    expires = new Date(Date.now() + (commonFunctions.calculateExpiry((App.Config.app.sessionTTL))));
                }

                req.session.cookie.maxAge = expires;
                //req.session.resetMaxAge();
                done(null,user);
            });
        }
    ));



    /*    passport.manualLogin = function(username,password,callback){
     passport.authenticate('local',function(err, user, info) {

     if (err) {
     console.log('err : ',err)
     return callback(err)
     }
     if (!user) {
     console.log('no user found')
     return callback(null, false, { message: 'Unknown user ' + username });
     }
     if (user.password != password) {
     console.log('wrong pass',user.password, password);
     return callback(null, false, { message: 'Invalid password' });
     }

     callback(null,user);
     })({body : {username:username,password:password}});
     };*/

    passport.middleware.local = function(settings){
        settings = lodash.merge(options,settings);
        return passport.authenticate('local',{
            successRedirect: settings.successRedirect,
            failureRedirect: settings.failureRedirect
        });
    }

});