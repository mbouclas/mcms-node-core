module.exports = (function(App){
    var wrench = require('wrench'),
        util = require('util'),
        path = require('path'),
        fs = require('fs');

    App.loadServices = function(dirName,namespaced,Package){

        var services = {};
        var files = wrench.readdirSyncRecursive(dirName);
        for (var a in files){
            var filename = files[a];

            if (path.extname(filename) == '.js'){
                var service = require(dirName + '/' + filename)(App,Package);
                var sr = new service();
                var nameSpace = '';
                if (namespaced) {//this usually applies to controllers, but services can be namespaced as well


                    if (typeof sr.nameSpace == 'undefined'){
                        var pathName = path.dirname(filename);
                        nameSpace = (pathName != '.' && pathName != '..') ? path.dirname(filename) + '/' : '';
                    } else {
                        nameSpace = sr.nameSpace + '/';
                    }

                }

                services[nameSpace + sr.name] = service;
            }
        }

        return services;
    }
});