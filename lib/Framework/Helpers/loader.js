module.exports = (function(App){
    var fs = require('fs');
    var lodash = require('lodash');
    var wrench = require('wrench'),
        util = require('util');
    var path = require('path');
    var common = require('../common'),
        Common = new common();


    var Config = {};


    var files = wrench.readdirSyncRecursive(__dirname);

    if (typeof App.Helpers == 'undefined'){
        App.Helpers = {};
    }

    for (var a in files){
        var file = files[a];

        if (path.extname(file) == '.js' && file.indexOf('loader') == -1){
            var helper = path.basename(file,'.js');
            App.Helpers[helper] = require(__dirname + '/' + file);
        }
    }

});
