module.exports = (function(App,expressSession){
    var cf = require('../../common'),
        commonFunctions = new cf();

    var expires = new Date(Date.now() + (commonFunctions.calculateExpiry(App.Config.app.sessionTTL)));

    return {
        secret: App.Config.auth.sessionSecret,
        saveUninitialized : App.Config.auth.options.saveUninitialized || true,
        resave : App.Config.auth.options.resave || false,
        maxAge : expires,
        cookie: { maxAge: expires }
    };
});