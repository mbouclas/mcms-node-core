module.exports = (function(App,Auth,passport,User){
    var FacebookStrategy = require('passport-facebook').Strategy,
        Helpers = require('./helpers');
    var redirects = {
        successRedirect : App.Config.auth.consumers.facebook.successRedirect,
        failureRedirect : App.Config.auth.consumers.facebook.failureRedirect,
        loginUrl : App.Config.auth.consumers.facebook.loginUrl
    };

    var strategy = {
        clientID: App.Config.auth.consumers.facebook.clientID,
        clientSecret: App.Config.auth.consumers.facebook.clientSecret,
        callbackURL: App.Config.auth.consumers.facebook.callbackURL
    };
    if (App.Config.auth.consumers.facebook.profileFields){
        strategy.profileFields = App.Config.auth.consumers.facebook.profileFields;
    }

    passport.use('facebook',new FacebookStrategy(strategy, loginFacebook));

    Auth.facebookLogin = function(req,res,next){
        console.log('returnTo, setup success : ' + req.session.returnTo);
        return passport.authenticate('facebook',{scope :  App.Config.auth.consumers.facebook.scope })(req,res,next);
    };

    Auth.facebookLoginCallback = function(req,res,next){

        return passport.authenticate('facebook',function(err, user, info){


            if (err) { return next(err); }
            if (!user) { return res.redirect(App.Config.auth.consumers.facebook.failureRedirect); }


            // If we have previously stored a redirectUrl, use that,
            // otherwise, use the default.

            var redirectTo = req.session.returnTo || redirects.successRedirect;


            req.logIn(user, function(err){
                if (err) { return next(err); }
                res.redirect(redirectTo);
                //delete req.session.returnTo;
            });

        })(req, res, next);

    };

    function loginFacebook(accessToken, refreshToken, profile, done) {
        //find or create user
        var now = new Date;

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


        User.findOne({email:profile.emails[0].value},function(err,user){
            if (err) {
                return done(err);
            }

            if (user) {
                user.updated_at = now;
                user.save(function (err) {
                    var loggedInUser = Helpers.sanitizeUserOutput(user);
                    done(null, Helpers.sanitizeUserOutput(loggedInUser));
                });

                return;
            }
            user_data.password = App.Helpers.common.str_random(8);
            return User.create(user_data,done);
         });
    }

});