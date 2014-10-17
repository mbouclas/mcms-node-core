var fs = require('fs');
var path = require('path');
module.exports = (function(App,Package){
    var engine = App.Config.view[App.Config.view.default];

    // set the view engine to use handlebars
    App.server.set('view engine', App.Config.view.default);

    //Load the driver, first check if we have a native
    if (!fs.existsSync(__dirname + '/drivers/' + engine.driver + '.js')){
        //no native driver found, try a require
        var driver = require(engine.driver)(App);
    } else {
        var driver = require('./drivers/' + engine.driver)(App);
    }




    App.server.use(App.express.static(App.Config.basePath + '/public'));
});