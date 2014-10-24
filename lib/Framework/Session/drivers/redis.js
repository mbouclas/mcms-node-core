module.exports = (function(App,expressSession){
    var RedisStore = require('connect-redis')(expressSession);
    return {store : new RedisStore({
        host: App.Config.database.redis.host,
        port: App.Config.database.redis.port,
        ttl : App.Config.app.sessionTTL
    }), secret: App.Config.auth.sessionSecret,
        saveUninitialized : App.Config.auth.options.saveUninitialized || true,
        resave : App.Config.auth.options.resave || true
    };

});