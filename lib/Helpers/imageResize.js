module.exports = (function(App){
    var path = require("path");
    var fs = require("fs");
    var im = require('imagemagick');
    var lo = require('lodash');
    var async = require("async");

   return function(sourceImage,fileName,destination,copies,callback){
       var asyncArr = [];
       lo.forEach(copies,function(copy){
           asyncArr.push(performResize.bind(null,sourceImage,copy));
       });

       async.parallel(asyncArr,callback);
   };

    function adaptiveResize(sourceImage,copy,next){
        im.convert([sourceImage, '-resize',copy.width+'x','-background','white','-gravity','center','-extent',
                copy.width + 'x'+copy.height, copy.destination],
            function(err, stdout){
                if (err) {
                    return(next(err));
                }
                next(null,true);
            });
    }

    function performResize(sourceImage,copy,next){

        im.resize({
            srcPath: sourceImage,
            dstPath: copy.destination,
            width: copy.width,
            height: copy.height,
            quality: copy.quality || 1,
            gravity: 'Center'
        }, function(err, stdout, stderr){
            if (err) {
                return(next(err));
            }

            next(null,true);
        });
    }
});