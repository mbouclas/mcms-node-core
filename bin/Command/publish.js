module.exports = (function(App){
    var colors = require('colors');
    var fs = require('fs-extra');
    var async = require('async');
    var baseDir = App.pathName + '/node_modules/';
    var publicPath = App.pathName + '/public/'

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
            if (fs.existsSync(defaultPaths[a])){//Fist default failed
                this.assetsFolder = defaultPaths[a];
                break;
            }
        }

        if (this.assetsFolder.length == 0){
            callback('assets not found',false);
        }

        var modulePath = publicPath + 'packages/' + this.module;

        var that = this;
        async.series([
            checkPublicFolder.bind(null,modulePath),
            copyFiles.bind(null,this.assetsFolder,modulePath)
        ],function(err,result){
            console.log(colors.green('command ' + that.name + ' fired'));
            callback(null,true);
        });
    }

    function checkPublicFolder(folder,callback){

        fs.mkdirs(folder,function(err){
            if (err){
                callback(err,'dir not created');
                return;
            }

           callback(null,'Dir created');
        });
    };

    function copyFiles(src,dest,callback){
        fs.copy(src,dest,function(err){
            if (err){
                callback(err,'files not copied');
                return;
            }

            callback(null,'files copied');
        });

    };

    return command;
});