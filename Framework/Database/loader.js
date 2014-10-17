module.exports = (function(App){
    var Config = App.Config.database;
    function loader(connection,options){
        var DB;
        //load the driver requested. First check if there is a global driver
        try {
            DB = require(Config[connection].driver)(Config[connection]);
        }
        catch (err){
            console.log(Config[connection].driver + ' no driver found');
        }

        //if not try to load it through the supported drivers
        try {
            DB = require(__dirname + '/drivers/' + Config[connection].driver)(Config[connection]);

        }
        catch (err){
            console.log(Config[connection].driver + ' no supported driver found');
        }

        if (typeof options.autoConnect) {
            DB.connection();
        }

        return DB;
    }

    loader.prototype.load = function(){
        DB.connection();
    }

    return loader;
});