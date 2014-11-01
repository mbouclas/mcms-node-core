module.exports = (function(App,Engine){
    var fs = require('fs');
    var driver = (typeof Engine == 'undefined') ? App.Config.auth.consumers[App.Config.auth.default].store : Engine;
    var Session;

    //Load the driver, first check if we have a native
    if (!fs.existsSync(__dirname + '/drivers/' +  driver + '.js')){
        //no native driver found, try a require
        Session =  require(driver)(App);
    } else {
        Session = require('./drivers/' + driver)(App);
    }

    return {
        setExpiry : function(expiry){
            Session.set
        }
    }
});