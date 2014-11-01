module.exports = (function(App,expressSession){
    return {
        secret: App.Config.auth.sessionSecret,
        saveUninitialized : App.Config.auth.options.saveUninitialized || true,
        resave : App.Config.auth.options.resave || false,
        maxAge : new Date(Date.now() + App.Config.app.sessionTTL * 60),
        cookie: { maxAge: App.Config.app.sessionTTL * 60 }
    };
});