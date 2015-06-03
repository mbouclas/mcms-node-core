module.exports = (function(App,Auth,passport,User){
    var passportLocal = require('passport-local').Strategy;

    Auth.loginAdmin = function(req,res,next){
        var redirects = {
            successRedirect : App.Config.auth.consumers.local.successRedirect,
            failureRedirect : App.Config.auth.consumers.local.failureRedirect,
            loginUrl : App.Config.auth.consumers.local.loginUrl
        };
        return globalLogin(req,res,next,redirects);
    };

    Auth.login = function(req,res,next){
        var redirects = {
            successRedirect : App.Config.auth.consumers.local.adminSuccessRedirect,
            failureRedirect : App.Config.auth.consumers.local.adminFailUrl,
            loginUrl : App.Config.auth.consumers.local.adminLoginUrl
        };
        return globalLogin(req,res,next,redirects);
    };

    function globalLogin(req,res,next,redirects){
        return passport.authenticate('local',function(err, userData, info) {
            if (err) {
                console.log('Passport error : ',err);
                req.flash('messageError', err);
                return res.redirect(redirects.failureRedirect);
            }

            if (!userData) {
                if (typeof info === 'object') {
                    info = '[[error:invalid-username-or-password]]';
                    req.flash('messageError',info);
                }

                return res.redirect(redirects.failureRedirect);
            }

            setExpiry(req);


            var redirectTo = req.session.returnTo || redirects.successRedirect;
            delete req.session.returnTo;

            req.login({
                    uid: userData.uid
                }, function(err) {
                    if (err) {
                        req.flash('messageError', err);
                        return res.redirect(redirects.failureRedirect);
                    }

                    return res.redirect(redirectTo);
                }
            );

        })(req, res, next);
    }

    function setExpiry(req){
        // Alter user cookie depending on passed-in option
        var expires,
            maxAge;
        if (req.body[App.Config.auth.credentials.rememberMeField]) {
            maxAge = App.Helpers.common.calculateExpiry(App.Config.auth.rememberMeTTL);
            expires = new Date(Date.now() + (maxAge));
        } else {
            maxAge = App.Helpers.common.calculateExpiry((App.Config.app.sessionTTL));
            expires = new Date(Date.now() + (maxAge));
        }

        req.session.cookie.maxAge = maxAge;
        req.session.cookie.expires = expires;
    }

    Auth.loginLocal = function(req, username, password, next){
        var lookUp = {};

        if (!username || !password) {
            return next('invalid-password]]');
        }

        lookUp[App.Config.auth.credentials.usernameField] = username;

        //Get user from DB via a service. Each service handles differently the fetch process
        //depending on the DB selected
        User.findOne(lookUp,function(err,userData){

            if (err) {
                console.log('Error: ',err);
                return res.status(403).send(err.message);
            }
            try {
                if (!App.Crypt.check(password,userData.password)) {
                    req.flash('messageError', 'passwordMismatch');
                    return next('wrong pass');
                }
            }
            catch (e){
                return next(e);
            }

            return next(null,{uid : userData.id});
        });

    };

    passport.use(new passportLocal({
        passReqToCallback : true,
        failureFlash: true,
        usernameField: App.Config.auth.credentials.usernameField,
        passwordField: App.Config.auth.credentials.passwordField
    }, Auth.loginLocal));


});