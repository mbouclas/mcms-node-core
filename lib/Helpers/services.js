var wrench = require('wrench'),
    path = require('path');

module.exports = (function(App){
    return {
        loadService : loadService
    };


function loadService(dirName,namespaced,Package){
    var services = {};
    var files = wrench.readdirSyncRecursive(dirName);
    for (var a in files){
        var filename = files[a];

        if (path.extname(filename) == '.js' && filename.indexOf('Helpers') == -1){
            var service = require(dirName + '/' + filename)(App,Package);
            var nameSpace = '';

            if (namespaced) {//this usually applies to controllers, but services can be namespaced as well
                if (typeof service.nameSpace == 'undefined'){
                    var pathName = path.dirname(filename);
                    nameSpace = (pathName != '.' && pathName != '..') ? path.dirname(filename) + '/' : '';
                } else {
                    nameSpace = service.nameSpace + '/';
                }
            }

            services[nameSpace + service.name] = service;
        }
    }

    return services;
}


});