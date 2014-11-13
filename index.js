module.exports = (function(App){
    App.serviceProviders = {};
    App.Database = {};
    App.templates = {};
    App.viewDirs = {};
    var async = require('async');
    App.lodash = require('lodash');
    App.async = require('async');
    var events = require('events');
    App.Event = new events.EventEmitter();
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    //var baseAppPath = process.env.NODE_PATH.replace(':','').replace(';','');
    var baseAppPath = App.pathName;

    var configPath = baseAppPath+'/App/Config';

    App.loadConfig = require('./lib/Framework/Config/loader');
    App.Config = App.loadConfig(configPath,baseAppPath);
    require('./lib/Framework/Log/loader')(App);
    require('./lib/Framework/Helpers/loader')(App);
    require('./lib/Framework/Crypt/loader')(App);
    require('./lib/Framework/Service/loader')(App);
    var Lang = require('mcms-node-localization');
    App.Lang = new Lang({
        locales : App.Config.app.locales
    });

    /*
     * Load databases
     */
    //default DB
    App.loadDatabaseDriver = require('./lib/Framework/Database/loader')(App);
    App.Database[App.Config.database.default] = new App.loadDatabaseDriver(App.Config.database.default);


    App.server = app;
    App.express = express;
    //App.server.set('view', require('express-prefixed-roots-view'));
    /*
    * initialize sessions
    */
    require('./lib/Framework/Session/session')(App,bodyParser);

    /*
     * Auth
     */
    require('./lib/Framework/Auth/loader')(App);

    require('./lib/Framework/ServiceProvider/loader')(App.Config.app.serviceProviders,App);


    if (typeof App.Config.database.redis != 'undefined' && App.Config.database.redis.host != 'null'){
        App.Database.redis = require('./lib/Framework/Database/redis')(App.Config.database.redis);
    }


    /*
     * Load server
     */
    App.lift = function(port,callback){
        port = (typeof port == 'undefined' || port == null) ? App.Config.app.serverPort : port;
        var server = App.server.listen(port);
        App.Io = require('./lib/Framework/Socket/loader')(server);
        callback(App);
        return server;
    };
    return App;
});
