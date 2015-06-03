module.exports = (function(App){
    var colors = require('colors');
    var fs = require('fs-extra');
    var async = require('async');
    var baseDir = App.Config.baseDir + '/node_modules/';
    var publicPath = App.Config.baseDir + '/public/';

    function command(){
        this.name = 'publish';
        this.description = 'publishes assets to public folder';
        this.options = {};
    }

    command.prototype.fire = function(callback){
        this.module = this.options['_'][1];

        var baseFolder = (typeof this.options.path == 'undefined') ? baseDir + this.module : this.options.path;
        var defaultPaths = [
            baseFolder + '/lib/public',
            baseFolder + '/public'
        ];
        this.assetsFolder = '';

        for (var a in defaultPaths){
            if (fs.existsSync(defaultPaths[a])){//First default failed
                this.assetsFolder = defaultPaths[a];
                break;
            }
        }

        var asyncArr = [];
        var modulePath = publicPath + 'packages/' + this.module;

        if (this.assetsFolder.length != 0){
            asyncArr.push(checkFolder.bind(null,modulePath));
            asyncArr.push(copyFiles.bind(null,this.assetsFolder,modulePath));
        }

        var that = this,
            destConfigFolder = App.Config.baseDir + '/App/Config/packages/' + this.module,
            moduleConfigFolder = baseFolder + '/Config';

        if (fs.existsSync(moduleConfigFolder)){//Check for config files
            asyncArr.push(checkFolder.bind(null,destConfigFolder));
            asyncArr.push(publishConfig.bind(null,moduleConfigFolder,destConfigFolder));
        }

        async.series(asyncArr,function(err,result){
            console.log(colors.green('command ' + that.name + ' fired'));
            callback(null,true);
        });
    };

    function checkFolder(folder,callback){
        console.log(folder)
        fs.mkdirs(folder,function(err){
            if (err){
                console.log(err,'dir not created');
                callback(err,'dir not created');
                return;
            }

           callback(null,'Dir created');
        });
    }

    function copyFiles(src,dest,callback){
        fs.copy(src,dest,function(err){
            if (err){
                callback(err,'files not copied');
                return;
            }

            callback(null,'files copied');
        });

    }

    function publishConfig(srcConfigFolder,destConfigFolder,callback){
        fs.copy(srcConfigFolder,destConfigFolder,function(err){
            if (err){
                console.log(err,'files not copied');
                callback(err,'files not copied');
                return;
            }

            callback(null,'files copied');
        });
    }

    return command;
});