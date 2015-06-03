module.exports = (function(App,Auth,passport,User){
    var FacebookStrategy = require('passport-facebook').Strategy;


    passport.use('facebook',new FacebookStrategy({
            clientID: App.Config.auth.consumers.facebook.clientID,
            clientSecret: App.Config.auth.consumers.facebook.clientSecret,
            callbackURL: App.Config.auth.consumers.facebook.callbackURL
        }, loginFacebook
    ));

    Auth.facebookLogin = function(req,res,next){
        return passport.authenticate('facebook',{scope :  App.Config.auth.consumers.facebook.scope })(req,res,next);
    };

    Auth.facebookLoginCallback = function(req,res,next){
        //
        return passport.authenticate('facebook',function(err, user, info){
            // This is the default destination upon successful login.
            var redirectUrl = App.Config.auth.consumers.facebook.callbackURL;

            if (err) { return next(err); }
            if (!user) { return res.redirect(App.Config.auth.consumers.facebook.failureRedirect); }


            // If we have previously stored a redirectUrl, use that,
            // otherwise, use the default.
            if (req.session.returnTo) {
                redirectUrl = req.session.returnTo;
                req.session.returnTo = null;
            }

            req.logIn(user, function(err){
                if (err) { return next(err); }
            });
            res.redirect(redirectUrl);
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
                    done(null, user);
                });

                return;
            }

            return User.create(user_data,done);
         });
    }

});