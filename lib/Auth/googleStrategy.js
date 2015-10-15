module.exports = (function(App,Auth,passport,User){
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
        Helpers = require('./helpers');
    var redirects = {
        successRedirect : App.Config.auth.consumers.google.successRedirect,
        failureRedirect : App.Config.auth.consumers.google.failureRedirect,
        loginUrl : App.Config.auth.consumers.google.loginUrl
    };
    passport.use(new GoogleStrategy({
            clientID: App.Config.auth.consumers.google.clientID,
            clientSecret: App.Config.auth.consumers.google.clientSecret,
            callbackURL: App.Config.auth.consumers.google.callbackURL
        }, loginGoogle
    ));

    Auth.googleLogin = function(req,res,next){
        return passport.authenticate('google',{scope :  App.Config.auth.consumers.google.scope })(req,res,next);
    };

    Auth.googleLoginCallback = function(req,res,next){

        return passport.authenticate('google',function(err, user, info){
            // This is the default destination upon successful login.
            var redirectUrl = App.Config.auth.consumers.google.callbackURL;

            if (err) { return next(err); }
            if (!user) { return res.redirect(App.Config.auth.consumers.google.failureRedirect); }

            // If we have previously stored a redirectUrl, use that,
            // otherwise, use the default.

            var redirectTo = req.session.returnTo || redirects.successRedirect;
            req.logIn(user, function(err){
                if (err) { return next(err); }
                res.redirect(redirectTo);
            });

        })(req, res, next);

    };

    function loginGoogle(accessToken, refreshToken, profile, done) {
        //find or create user
        var now = new Date;

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


        User.findOne({email:profile.emails[0].value},function(err,user){
            if (err) {
                return done(err);
            }

            if (user) {
                user.updated_at = now;
                user.save(function (err) {
                    var loggedInUser = Helpers.sanitizeUserOutput(user);
                    done(null, loggedInUser);
                });

                return;
            }
            user_data.password = App.Helpers.common.str_random(8);
            return User.create(user_data,done);
        });
    }

/*
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

                    new User(user_data).save(function(err, user) {
                        if(err) { throw err; }
                        done(null, user);
                    });

                });
            });
        }
    ));

*/


});