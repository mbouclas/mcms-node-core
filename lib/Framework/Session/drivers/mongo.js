module.exports = (function(App,expressSession){
    var MongoStore = require('connect-mongo')(expressSession);

    return {store : new MongoStore({
        host: App.Config.database.redis.host,
        port: App.Config.database.redis.port,
        db : App.Config.database.redis.db,
        cookie: { maxAge: App.Config.app.sessionTTL * 60 }
    }), secret: App.Config.auth.sessionSecret,
        saveUninitialized : App.Config.auth.options.saveUninitialized || true,
        resave : App.Config.auth.options.resave || false
    };
});