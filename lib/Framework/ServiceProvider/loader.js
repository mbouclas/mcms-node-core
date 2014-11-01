module.exports = (function(sp,App){
    var fs = require('fs');
    var path = require('path');
    var async = require('async');
    var Config = App.Config;
    var serviceProviders = {};
    var basePath = Config.basePath + '/node_modules/';

    var asyncObj = {};
    for (var a in sp){

        asyncObj[sp[a]] = function(sp,callback){
            if (sp.indexOf('./') != -1){//local provider, not in node_modules
                basePath = basePath.replace('/node_modules','');
            }
            var packagePath = path.dirname(fs.realpathSync(basePath + sp +'.js'));
            var pr = require(basePath + sp)(App),
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
                if (fs.existsSync(packagePath + '/Controllers')){
                    App.serviceProviders[provider.packageName].controllers = App.loadServices(packagePath + '/Controllers',true);//load possible controllers
                    Route.registerControllers(App.serviceProviders[provider.packageName].controllers);
                }

                require(baseAppPath + '/routes')(App, App.serviceProviders[provider.packageName], Route);

            }
            callback(null,sp);
        }.bind(null,sp[a]);

    }

    async.series(asyncObj,function(err,results){

        if (typeof App.registerTemplates != 'undefined'){
            App.registerTemplates();//this bit is async, templates will not be available straight away
        }
    });




    //App.server.set('views', App.viewDirs);
    return serviceProviders;
});