module.exports = (function (Config) {
    var redis = require("redis");
    var client = redis.createClient(Config.port,Config.host);

    return {client : client, module:redis};
});