module.exports = (function(Config,loader){
    var Connection = loader(Config,{});
    Connection.connect(Config.options);
    return Connection;
});