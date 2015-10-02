module.exports = (function(App){
    var fs = require('fs');
    var lodash = require('lodash');
    var wrench = require('wrench'),
        util = require('util');
    var path = require('path');


    if (typeof App.Helpers == 'undefined'){
        App.Helpers = {};
    }

    return {
        loadHelpers : loadHelpers
    };

    function loadHelpers(dir){
        var files = wrench.readdirSyncRecursive(dir);

        for (var a in files){
            var file = files[a];

            if (path.extname(file) == '.js' && file.indexOf('loader') == -1){
                var helper = path.basename(file,'.js');
                App.Helpers[helper] = require(dir + '/' + file);
               if (lodash.isFunction(App.Helpers[helper])){
                   App.Helpers[helper] = App.Helpers[helper](App);
               }
            }
        }

        return this;
    }

});
