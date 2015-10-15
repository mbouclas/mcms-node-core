module.exports = (function (App, expressSession) {
    var RedisStore = require('connect-redis')(expressSession);
    var expiresInMs = App.Helpers.common.calculateExpiry(App.Config.app.sessionTTL);
    var expires = new Date(Date.now() + expiresInMs);

    return {
        store: new RedisStore({
            host: App.Config.database.redis.host,
            port: App.Config.database.redis.port,
            collection: 'sessions',
            socket_keepalive: true,
            pass: App.Config.database.redis.password || '',// optional
            ttl: expiresInMs / 1000//looking for seconds
        }), secret: App.Config.auth.sessionSecret,
        saveUninitialized: App.Config.auth.options.saveUninitialized || true,
        resave: App.Config.auth.options.resave || false,
        maxAge: expires,
        cookie: {
            maxAge: expires,
            domain: '.' + App.Config.app.url,
            path: '/'
        }
    };

});