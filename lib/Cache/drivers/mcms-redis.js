module.exports = (function(App,Engine){
    var settings = (typeof Engine == 'undefined') ? App.Config.cache[App.Config.cache.default] : Engine.settings;
    var lo = require('lodash');


    var prefix = App.Config.cache.prefix || '';

    return {
        get : function(tag,key,callback){

            App.Connections.redis.hget(setTag(tag), key, function(err,result){
                if (err){
                    return callback(err);
                }

                return callback(null,JSON.parse(result));
            });
        },
        has : function(tag,key,callback){

            App.Connections.redis.hget(setTag(tag) ,key, function(err,result){
                if (err){
                    return callback(err);
                }

                var ret = (result) ? JSON.parse(result) : false;
                return callback(null,ret);
            });
        },
        put : function(tag,key,value,ttl,callback){
            var Redis = App.Connections.redis;
            if (arguments.length == 3){
                var callback = function(err){};
            }

            if (lo.isFunction(arguments[3])){
                var callback = arguments[3];
                var ttl = 0;
            }


            value = JSON.stringify(value);

            Redis.hset(setTag(tag),key, value, function(err){
                if (err){
                    App.Log.error(err);
                    return callback(err);
                }

                if (ttl != 0){
                    return Redis.expire(key,ttl,callback);
                }

                return callback(null);
            });

        },
        remove : function(tag,key,callback){

            App.Connections.redis.hdel(setTag(tag), key, callback);
        },
        flush : function(tag,callback){

            App.Connections.redis.del(setTag(tag), callback);
        }
    };

    function setTag(tag){
        return prefix + tag;
    }
});