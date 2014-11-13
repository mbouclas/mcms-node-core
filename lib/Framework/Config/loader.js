module.exports = (function(configPath,baseAppPath){
    var fs = require('fs');
    var lodash = require('lodash');
    var wrench = require('wrench'),
        util = require('util'),
        path = require('path');
    var common = require('../common'),
        Common = new common();


    var Config = {};


    var configFiles = wrench.readdirSyncRecursive(configPath);
    var env = Common.detectEnv(GLOBAL.env);
    Config.basePath = baseAppPath;

    for (var a in configFiles){
        var file = configFiles[a];
        if (path.extname(file) == '.json'){
            var conf = path.basename(file,'.json');
            if (typeof Config[conf] != 'undefined'){
                if (file.match(env)){
                    Config[conf] = lodash.merge(Config[conf],require(configPath + '/' + file));
                }
                continue;
            }
            Config[conf] = require(configPath + '/' + file);
        }
    }
    return Config;
});


//module.exports = Config;

