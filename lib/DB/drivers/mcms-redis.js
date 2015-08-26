module.exports = (function(Config,App){
    var redis = require('redis');

    var Driver =  {
        models : {},
        redis : redis,
        client : {},
        connect : function(options){
            var client = redis.createClient(Config.port,Config.host,{
                socket_keepalive : true,
                auth_pass : Config.password || null// optional
            });
            if (Config.password){
                client.auth(Config.password,function(err){
                    if (err){
                        App.Log.error(err);
                    }
                });
            }
            this.client = client;
            return client;
        },
        loadModels : function(path){
        }
    };

    return Driver;
});