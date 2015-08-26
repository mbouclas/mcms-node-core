module.exports = (function(App){
    var lo = require('lodash');
    var Command = App.Command(App);
    var path = require('path');

    function coreServiceProvider(){
        this.packageName = 'mcms-core';
        this.services = {};
        this.controllers = {};

        App.dbLoader[App.Config.database.default].loadModels(__dirname + '/Models/' + App.Config.database.default);
        //method overload. We replace the App.User of the base App.User with an implementation. Before now it was
        //just a function which needed instantiation
        App.User = require(App.Config.baseDir + '/' + App.Config.auth.user.model)(App);

        if (App.CLI){
            var commandFolder = path.join(__dirname , '../bin/Command/');
            Command.registerCommand([
                commandFolder + 'publish',
                commandFolder + 'generate'
            ]);

            return;
        }
        App.Auth = require('./Auth/authentication')(App);
        App.Auth.initialize(App.server,App.Auth.middleware);
        App.Lang = require('./Lang/loader')(App);

    }



    return new coreServiceProvider();
});