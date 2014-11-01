module.exports = (function(App,Engine){
    var fs = require('fs');
    var driver = (typeof Engine == 'undefined') ? App.Config.crypt[App.Config.crypt.default].driver : Engine;
    var crypter;

    //Load the driver, first check if we have a native
    if (!fs.existsSync(__dirname + '/drivers/' +  driver + '.js')){
        //no native driver found, try a require
        crypter =  require(driver)(App);
    } else {
        crypter = require('./drivers/' + driver)(App);
    }

    App.Crypt = crypter;
    return crypter;
});