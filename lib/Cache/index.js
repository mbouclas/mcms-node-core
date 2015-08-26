module.exports = (function(App,Engine){
    var fs = require('fs');
    var driver = (typeof Engine == 'undefined') ? App.Config.cache[App.Config.cache.default].driver : Engine;
    var cache;

    //Load the driver, first check if we have a native
    if (!fs.existsSync(__dirname + '/drivers/' +  driver + '.js')){
        //no native driver found, try a require
        cache =  require(driver)(App);
    } else {
        cache = require('./drivers/' + driver)(App);
    }


    return cache;
});