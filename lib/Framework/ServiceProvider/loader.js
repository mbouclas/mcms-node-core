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
        if (typeof provider.App != 'undefined'){
            App.server.use(provider.App);
        }

        serviceProviders[provider.packageName] = provider;
        var baseAppPath = packagePath;
        var configPath = packagePath+'/Config';
        if (fs.existsSync(configPath)){
            var conf = require('../Config/loader')(configPath,baseAppPath);
            App.serviceProviders[provider.packageName].Config = conf.config;
        }

        if (fs.existsSync(baseAppPath + '/routes.js')) {
            require('../View/loader')(App,provider);
            var Route = require('../Route/router')(App,provider.App);
            require(baseAppPath + '/routes')(App, App.serviceProviders[provider.packageName], Route);

        }
    }

    if (typeof App.registerTemplates != 'undefined'){
        App.registerTemplates();//this bit is async, templates will not be available straight away
    }


    //App.server.set('views', App.viewDirs);
    return serviceProviders;
});