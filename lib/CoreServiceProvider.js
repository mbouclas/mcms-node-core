module.exports = (function(App){
    var express = require('express');
    var miniApp = express();
    var Command = require('mcms-node-core/lib/Framework/Command/loader')(App);

    function core(){
        this.packageName = 'core';

        this.App = miniApp;

        this.auth = {};
        this.viewDirs =  __dirname + '/views';

        this.models = App.Database[App.Config.database.default].loadModels(App.Database[App.Config.database.default].mongoose,
            __dirname + '/Models');

        var auth = new App.loadAuth();

        this.auth = auth.loadStrategies(this.models.User);//we are loading the model from the core repository

        this.services = App.loadServices(__dirname + '/Services');

        Command.registerCommand([
            'mcms-node-core/bin/Command/publish'
        ]);
    }




    return core;
});