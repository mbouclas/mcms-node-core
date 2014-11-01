var lo = require('lodash');
module.exports = (function(App){
    var Config = App.Config.database;
    /*
    * options can contain a driverOptions property to be passed to the driver
    */
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
            DB = require(Config[connection].driver)(Config[connection]);
        }
        catch (err){
            console.log(Config[connection].driver + ' no driver found');
        }

        //if not try to load it through the supported drivers
        try {
            DB = require(__dirname + '/drivers/' + Config[connection].driver)(App,Config[connection]);

        }
        catch (err){
            console.log(__dirname + '/drivers/' + Config[connection].driver + ' no supported driver found');
        }

        if (typeof options.autoConnect) {
            DB.connect(lo.merge(driverOptions,Config[connection]));
        }

        return DB;
    }

    loader.prototype.load = function(){
        DB.connection();
    };

    loader.prototype.loadModel = function(modelName){

    };

    return loader;
});