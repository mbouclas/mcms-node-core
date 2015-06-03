module.exports = (function(App){
    var middleware = {
        admin: {}
    },
        csrf = require('csurf');

    middleware.applyCSRF = csrf();

    middleware.authenticate = function(req, res, next) {

        req.session.returnTo = req.originalUrl;
        if (req.isAuthenticated()) {
            return next();
        }


        //not allowed logic
        req.flash('messageError', 'notAllowed');
        return res.redirect(App.Config.auth.consumers.local.loginUrl);
    };

    middleware.redirectToAccountIfLoggedIn = function(req, res, next) {
        if (!req.user) {
            return next();
        }

    };

    middleware.redirectToLoginIfGuest = function(req, res, next) {
        if (!req.user || parseInt(req.user.uid, 10) === 0) {
/*            req.session.returnTo = nconf.get('relative_path') + req.url.replace(/^\/api/, '');
            return res.redirect(nconf.get('relative_path') + '/login');*/
        } else {
            next();
        }
    };

    middleware.checkAccountPermissions = function(req, res, next) {

    };

    middleware.isAdmin = function(req, res, next) {
        req.session.returnTo = req.originalUrl;
        function notAllowedInLogic(){
            //not allowed logic
            req.flash('messageError', 'notAllowed');
            return res.redirect(App.Config.auth.consumers.local.adminLoginUrl);
        }

        if (!req.isAuthenticated()) {
            return notAllowedInLogic();
        }

        App.User.admin.isAdmin(req.user,function(err,isAdmin){
            if (err){
                return notAllowedInLogic();
            }


            req.flash('messageSuccess', 'LogInSuccess');

            if (!req.session.returnTo || req.originalUrl == App.Config.auth.consumers.local.adminLoginUrl){
                return res.redirect(App.Config.auth.consumers.local.adminSuccessRedirect);
            }

            return next();
        });



    };

    return middleware;
});