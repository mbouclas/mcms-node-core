module.exports = (function(App,expressSession){
    var RedisStore = require('connect-redis')(expressSession);
    var expires = new Date(Date.now() + (App.Helpers.common.calculateExpiry(App.Config.app.sessionTTL)));

    return {
        store : new RedisStore({
            host: App.Config.database.redis.host,
            port: App.Config.database.redis.port,
            collection: 'sessions',
            socket_keepalive : true,
            pass : App.Config.database.redis.password || ''// optional
            //expire : App.Config.app.sessionTTL * 60
    }), secret: App.Config.auth.sessionSecret,
        saveUninitialized : App.Config.auth.options.saveUninitialized || true,
        resave : App.Config.auth.options.resave || false,
        maxAge : expires,
        cookie: {
            maxAge: expires,
            domain : App.Config.app.url,
            path : '/'
        }
    };

});