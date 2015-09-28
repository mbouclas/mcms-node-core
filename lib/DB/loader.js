var lo = require("lodash");

module.exports = (function(App){
    var Connections = {
        loadConnection : loadConnection,
        loadAllConnections : loadAllConnections,
        loader : loader
    },
        Config = App.Config;

    return Connections;

    function loadAllConnections(){
         for (var db in Config.database){
             if (db === 'default') {
             continue;
             }

             Connections[db] = require(__dirname + '/' + db)(Config.database[db],loader);
         }
    }

    function loadConnection(Connection,config){

        Connections[Connection] = require(__dirname + '/' + Connection)(config || Config.database[Connection],loader);

        return Connections[Connection];
    }

    function loader(connection,options){
        var DB,
            driverOptions = {};

        options = lo.merge({
            autoConnect : true
        },options);

        if (typeof options.driverOptions != 'undefined'){
            driverOptions = options.driverOptions;
        }

        //load the driver requested. First check if there is a global driver
        try {
            DB = require(connection.driver)(connection);
            return DB;
        }
        catch (err){
            console.log(connection.driver + ' no global driver found');
        }
        //require(__dirname + '/drivers/' + connection.driver)(connection);
        //if not try to load it through the supported drivers
        try {
            DB = require(__dirname + '/drivers/' + connection.driver)(connection);
        }
        catch (err){
            console.log(__dirname + '/drivers/' + connection.driver + ' no local driver found');
        }

        return DB;
    }
});