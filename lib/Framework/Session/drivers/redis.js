module.exports = (function(App,expressSession){
    var RedisStore = require('connect-redis')(expressSession);
    return {
        store : new RedisStore({
            host: App.Config.database.redis.host,
            port: App.Config.database.redis.port,
            collection: 'sessions' // optional
            //expire : App.Config.app.sessionTTL * 60
    }), secret: App.Config.auth.sessionSecret,
        saveUninitialized : App.Config.auth.options.saveUninitialized || true,
        resave : App.Config.auth.options.resave || false,
        maxAge : new Date(Date.now() + App.Config.app.sessionTTL * 60),
        cookie: { maxAge: App.Config.app.sessionTTL * 60 }
    };

});