module.exports  = (function(App,Package){
    var async = require('async');
    var lo = require('lodash');


    function Item(models){
        this.name = 'Item';
        this.Models = models;
        this.withActions = [];
    }

    Item.prototype.with = function(actions){
        if (typeof actions == 'string'){
            this.withActions.push(actions);
            return this;
        }

        var len = actions.length;
        for (var i = 0;len > i;i++){
            this.withActions.push(actions[i]);
        }

        return this;
    }

    Item.prototype.getImages = function(model,images,options,callback){
        var ids = [],
            imgObjs = {};
        var len = images.length;
        if (len == 0){
            return callback(null,[]);
        }

        for (var i = 0; len > i;i++){
            ids.push(images[i].id);
            imgObjs[images[i].id] = images[i];
        }

        this.Models[model].where('_id').in(App.Helpers.Model.arrayToObjIds(ids)).exec(function(err,imagesFound){
            var ret = [];
            for (var a in imagesFound){
                ret.push(lo.merge(imagesFound[a].copies,imgObjs[imagesFound[a].id]));
            }

            return callback(null,ret);
        });
    };

    Item.prototype.getThumb = function(model,img,options,callback){
        if (lo.isArray(img)){
            var ids = [];
            for (var a in img){
                ids.push(img[a].id);
            }
            return this.Models[model].where('_id').in(App.Helpers.Model.arrayToObjIds(ids)).exec(callback);
        }


        this.Models[model].findById(img.id,function(err,thumb){

            if (!thumb){
                return callback(null,img);
            }

            var ret = lo.merge(thumb.copies,img);

            return callback(null,ret);
        });
    };


    return Item;
});