module.exports = (function(App,expressSession){
    return {
        secret: App.Config.auth.sessionSecret,
        saveUninitialized : App.Config.auth.options.saveUninitialized || true,
        resave : App.Config.auth.options.resave || true
    };
});