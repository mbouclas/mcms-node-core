module.exports = (function(App) {
    var lodash = require('lodash');

    App.loadAuth = function(strategy,userModel,options){
        //load per driver options
        try{
            var baseOptions = require(__dirname + '/drivers/' + App.Config.database[App.Config.database.default].driver)(App,userModel);
        }
        catch (err){
            console.log('no driver for this auth found');
        }

        options = lodash.merge(baseOptions,options);
        return require(__dirname + '/strategies/' + strategy)(App,options);
    }


});