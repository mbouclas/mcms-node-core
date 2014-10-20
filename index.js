module.exports = (function(App){
    App.serviceProviders = {};
    App.Database = {};
    var async = require('async');
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var baseAppPath = process.env.NODE_PATH.replace(':','');
    var configPath = baseAppPath+'/App/Config';
    App.loadConfig = require('./Framework/Config/loader');
    App.Config = App.loadConfig(configPath,baseAppPath);

    /*
     * Load databases
     */
    //default DB
    App.loadDatabaseDriver = require('./Framework/Database/loader')(App);
    App.Database[App.Config.database.default] = new App.loadDatabaseDriver(App.Config.database.default);

    App.server = app;
    App.express = express;
    /*
    * initialize sessions
    */
    require('./Framework/Session/session')(App,bodyParser);

    /*
     * Auth
     */
    require('./Framework/Auth/loader')(App);
    require('./Framework/View/loader')(App);
    require('./Framework/ServiceProvider/loader')(App.Config.app.serviceProviders,App);






    if (typeof App.Config.database.redis != 'undefined' && App.Config.database.redis.host != 'null'){
        App.Database.redis = require('./Framework/Database/redis')(App.Config.database.redis);
    }

    /*
     * Load server
     */
    App.lift = function(port,callback){
        port = (typeof port == 'undefined' || port == null) ? App.Config.app.serverPort : port;
        var server = App.server.listen(port,callback);
        App.Io = require('./Framework/Socket/loader')(server);

        return server;
    };
    return App;
});
