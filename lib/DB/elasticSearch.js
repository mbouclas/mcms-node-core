module.exports = (function(Config,loader){
    var Connection = loader(Config,{});
    Connection.connect();

    return Connection.client;
});