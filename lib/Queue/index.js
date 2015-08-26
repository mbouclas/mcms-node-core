module.exports = (function(App){

    return loadDriver;

    function loadDriver(connection){
        var Conn;

        try {
            Conn = require(connection.driver)(connection);
        }
        catch (err){


        }

        //if not try to load it through the supported drivers
        try {
            Conn = require(__dirname + '/drivers/' + connection.driver)(connection);
        }
        catch (err){
            App.Log.error(err)
        }

        return Conn;
    }
});