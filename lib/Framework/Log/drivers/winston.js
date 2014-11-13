module.exports = (function(App,Config,logFile){
    var winston = require('winston');
    var transports = [];

    if (Config.transports.indexOf('console') != -1){
        transports.push(new (winston.transports.Console)());
    }

    if (Config.transports.indexOf('file') != -1){
        var path = Config.logDir.replace('$appPath',App.pathName);
        if (typeof logFile == 'undefined'){
            logFile = path + '/' + Config.logFile;
        }
        transports.push(new (winston.transports.File)({ filename: logFile }));

    }

    var Log = new (winston.Logger)({
        transports: transports
    });

    return Log;
});