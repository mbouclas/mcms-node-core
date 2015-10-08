module.exports = (function(App) {
    var path = require("path");
    var fs = require("fs-extra");
    var async = require('async');
    var lo = require('lodash');
    var imageResize = require('./imageResize')(App);
    var Config = {},
        SourceFile = {},
        baseDir = '',
        Item = {},
        ImageModel = {};

    return function(file,config,item,callback){
        Item = item;
        Config = config;
        SourceFile = file;
/*        var regex = new RegExp('(:[a-zA-z0-9]+)','g'),
            params = Config.dir.match(regex),
            dir = Config.dir;
        for (var i in params){
            var param = params[i].replace(':','');
            dir = dir.replace(params[i],item[param]);
        }*/
        baseDir = replaceParams(Config.dir,item);



        var asyncArr = [
            createFolders.bind(null,baseDir,Config.copies,file),
            resizeImage,
            moveOriginal
        ];

        async.waterfall(asyncArr,function(err,result){
            App.Event.emit('image.upload.complete',result);//the result is the Image object
            callback(err,result);
        });
    };


    function createFolders(baseDir,folders,file,next){
        if (!fs.existsSync(baseDir)){
            fs.mkdirSync(baseDir);
        }

        for (var i in folders){
            if (!fs.existsSync(baseDir + folders[i].dir)){
                fs.mkdirSync(baseDir + folders[i].dir);
            }
        }

        if (Config.keepOriginals && !fs.existsSync(baseDir + 'originals')){
            fs.mkdirSync(baseDir + 'originals');
        }

        next(null,baseDir,folders,file);
    }

    function resizeImage(destinationDir,folders,file,next){

        var Image = {
            originalFile : file.originalname,
            copies : {}
        };

        for (var i in folders){
            var destination = path.join(App.Config.baseDir ,destinationDir + folders[i].dir);

            folders[i].destination = destination + folders[i].prefix + file.originalname;
            var strippedPath = destination.replace(path.join(App.Config.baseDir , App.Config.app.publicDir),'')
                + folders[i].prefix + file.originalname;


            Image.copies[i] = {
                imagePath : folders[i].destination,
                imageUrl : '/' + strippedPath.replace(/\\/g,'/')
            };
        }

        imageResize(file.path,file.name,destination,folders,function(err,results){
            next(null,file,Image);
        });

    }

    function moveOriginal(file,Image,next){

        if (!Config.keepOriginals){
            return next(null,file);
        }

        fs.move(file.path,baseDir + 'originals/' + file.originalname,{clobber : true},function(err,result){
            Image.copies.originals = {
                imagePath : path.join(App.Config.baseDir ,baseDir + 'originals/' + file.originalname),
                imageUrl : replaceParams(App.Config.image.products.url,Item) + 'originals/' + file.originalname
            };
            next(null,Image);
        });
    }

    function cleanUp(next){
        fs.unlink(SourceFile.path,next);
    }

    function replaceParams(string,item){
        var regex = new RegExp('(:[a-zA-z0-9]+)','g'),
            params = string.match(regex),
            temp = string;
        for (var i in params){
            var param = params[i].replace(':','');
            temp = temp.replace(params[i],item[param]);
        }

        return temp;
    }
});