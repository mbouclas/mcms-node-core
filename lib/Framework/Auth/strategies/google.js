module.exports = (function(App,userModel,passport,options){
    var lodash = require('lodash');
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var moment = require('moment');


    options = lodash.merge({
        loginUrl : '/login',
        successRedirect : '/',
        failureRedirect : '/login'
    },options);

    var handler = options.handlers;

    passport.use(new GoogleStrategy({
            clientID: options.clientID,
            clientSecret: options.clientSecret,
            callbackURL: options.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {

                handler.findByCredentials({email:profile.emails[0].value},function(err,user){
                    var now = new Date;

                    if (err) { return done(err); }
                    if (user) {
                        user.updated_at = now;
                        user.save(function(err){
                             done(null, user);
                        });
                        return;
                    }


                    console.log('creating... Google user')
                    var user_data = {
                         username:  profile.emails[0].value
                        , email:  profile.emails[0].value
                        , googleID:    profile.id
                        , created:  now
                        , firstName : profile.given_name
                        , lastName : profile.family_name
                        , active : 1
                        , activated_at : now
                        , remember_token : accessToken
                        , permissions : {}
                        , preferences : {}
                        , userClass : 'U'
                    };

                    new userModel(user_data).save(function(err, user) {
                        if(err) { throw err; }
                        done(null, user);
                    });

                });
            });
        }
    ));


    passport.middleware.google = function(settings){
        settings = lodash.merge(options,settings);

        return passport.authenticate('google',{
            successRedirect: settings.successRedirect,
            failureRedirect: settings.failureRedirect
        });
    };


});