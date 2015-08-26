module.exports = (function(App){
    var Localizer = require('mcms-node-localization');
    var wrench = require('wrench'),
        fs = require('fs-extra'),
        util = require('util');
    var path = require('path');

    var Lang = new Localizer({
        directory : App.Config.baseDir + App.Config.app.localesDir,
        locales : App.Config.app.locales
    });

    Lang.add();
    var files = fs.readdirSync(App.Config.baseDir + App.Config.app.localesDir + '/packages');
    files.forEach(function(file){
        Lang.add({
            directory : App.Config.baseDir + App.Config.app.localesDir + '/packages/' + file,
            locales : App.Config.app.locales
        });
    });

    return Lang;
});
