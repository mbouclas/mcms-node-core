module.exports = (function(App) {
    var lodash = require('lodash');
    var passport = require('passport')
    var flash = require('connect-flash');
    passport.middleware = {};

    loadAuth = function(){
        this.strategies = {};
    }

    loadAuth.prototype.loadStrategies = function(userModel){

        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            userModel.findById(id,function(err,user){
                done(err,user);
            });
        });

        passport.isAuthenticated = function (req, res, next) {

            if (req.isAuthenticated()) {
                return next();
            }

            res.redirect(options.loginUrl);
        };

        for (var a in App.Config.auth.consumers){
         var consumer = App.Config.auth.consumers[a];
         this.loadStrat(consumer.strategy,userModel,passport,consumer);

         }



        App.server.use(passport.initialize());
        App.server.use(passport.session());
        App.server.use(flash());
        return passport;
    }


    loadAuth.prototype.loadStrat = function(strategy,userModel,passport,options){
        //load per driver options
        try{
            var baseOptions = require(__dirname + '/drivers/' + App.Config.database[App.Config.database.default].driver)(App,userModel);
        }
        catch (err){
            console.log('no driver for this auth found');
        }

        options = lodash.merge(baseOptions,options);
        return require(__dirname + '/strategies/' + strategy)(App,userModel,passport,options);
    }

    App.loadAuth = loadAuth;

    return loadAuth;
});