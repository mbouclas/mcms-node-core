module.exports = (function(App){
    var fs = require('fs');
    var lo = require("lodash");
    var path = require('path');
    var Config = App.Config;
    var basePath = Config.baseDir + '/node_modules/';
    var serviceProviders = {};

    function registerProvider(Provider){
        if (lo.isArray(Provider)){
            for (var a in Provider){
                addProvider(Provider[a]);
            }
            return;
        }

        addProvider(Provider);
    }

    function addProvider(ProviderName){
        if (ProviderName.indexOf('./') != -1){//local provider, not in node_modules
            basePath = basePath.replace('/node_modules','');
        }

        var packagePath = path.dirname(fs.realpathSync(basePath + ProviderName +'.js'));
        var provider = require(basePath + ProviderName)(App);
        serviceProviders[provider.packageName] = provider;
    }

    function listProviders(){
        return this.serviceProviders;
    }

    function getServiceProvider(name){
        return this.serviceProviders[name] || {};
    }

    return {
        get : getServiceProvider,
        serviceProviders : serviceProviders,
        registerProvider : registerProvider,
        listProviders : listProviders
    };
});