module.exports = (function(App,userModel,passport,options){
    var lodash = require('lodash');
    var FacebookStrategy = require('passport-facebook').Strategy;
    var moment = require('moment');


    options = lodash.merge({
        loginUrl : '/login',
        successRedirect : '/',
        failureRedirect : '/login'
    },options);

    var handler = options.handlers;

    passport.use('facebook',new FacebookStrategy({
            clientID: options.clientID,
            clientSecret: options.clientSecret,
            callbackURL: options.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {

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
                console.log('creating... FB user')
                var user_data = {
                     username:  profile.emails[0].value
                    , email:  profile.emails[0].value
                    , fbID:    profile.id
                    , created:  now
                    , firstName : profile.name.givenName
                    , lastName : profile.name.familyName
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
        }
    ));


    passport.middleware.facebook = function(settings){
        settings = lodash.merge(options,settings);

        return passport.authenticate('facebook',{
            successRedirect: settings.successRedirect,
            failureRedirect: settings.failureRedirect
        });
    };

});