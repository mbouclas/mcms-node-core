module.exports = (function(App,expressSession){


    var expires = new Date(Date.now() + (App.Helpers.common.calculateExpiry(App.Config.app.sessionTTL)));

    return {
        secret: App.Config.auth.sessionSecret,
        saveUninitialized : App.Config.auth.options.saveUninitialized || true,
        resave : App.Config.auth.options.resave || false,
        maxAge : expires,
        cookie: {
            maxAge: expires,
            domain : '.' + App.Config.app.url,
            path : '/'
        }
    };
});