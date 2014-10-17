module.exports = (function(sp,App){
    var fs = require('fs');
    var path = require('path');
    var Config = App.Config;
    var serviceProviders = {};
    var basePath = Config.basePath + '/node_modules/';

    for (var a in sp){

        var packagePath = path.dirname(fs.realpathSync(basePath + sp[a]+'.js'));
        var pr = require(basePath + sp[a])(App),
            provider = new pr();
        App.serviceProviders[provider.packageName] = provider;
        serviceProviders[provider.packageName] = provider;
        var baseAppPath = packagePath;
        var configPath = packagePath+'/Config';
        if (fs.existsSync(configPath)){
            var conf = require('../Config/loader')(configPath,baseAppPath);
            App.serviceProviders[provider.packageName].Config = conf.config;
        }

        if (fs.existsSync(baseAppPath + '/routes.js')) {
            require(baseAppPath + '/routes')(App, App.serviceProviders[provider.packageName]);
        }
    }

    return serviceProviders;
});