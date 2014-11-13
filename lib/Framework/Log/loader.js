module.exports = (function(App,Engine){
    var fs = require('fs');
    var driver = (typeof Engine == 'undefined') ? App.Config.log[App.Config.log.default].driver : Engine;
    var Log;

    //Load the driver, first check if we have a native
    if (!fs.existsSync(__dirname + '/drivers/' +  driver + '.js')){
        //no native driver found, try a require
        Log =  require(driver)(App,App.Config.log[App.Config.log.default]);
    } else {
        Log = require('./drivers/' + driver)(App,App.Config.log[App.Config.log.default]);
    }

    App.Log = Log;
    return Log;
});