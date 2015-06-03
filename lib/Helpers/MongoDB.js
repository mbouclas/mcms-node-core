module.exports = (function(App){
    var mongoose = require('mongoose');
    var lo = require('lodash');

    return {
        arrayToObjIds : arrayToObjIds,
        sanitizeModel : sanitizeModel,
        idToObjId : idToObjId,
        setupFilters : setupFilters,
        itemImages : itemImages,
        itemThumb : itemThumb
    };

    function arrayToObjIds(arr){
        if (typeof arr == 'undefined' || arr.length == 0){
            return [];
        }

        var ids = [];
        var len = arr.length;
        for (var i=0; i<len; ++i) {
            if (lo.isObject(arr[i])){
                ids.push(arr[i]);
                continue;
            }

            if (!lo.isString(arr[i])){
                continue;
            }

            var _id = null;
            try {
                _id = new mongoose.Types.ObjectId(arr[i]);
            } catch (e){
                _id = false;
            }

            ids.push(_id);
        }

        return ids;
    }

    function sanitizeModel(source,extra){
        var model = App.lodash.clone(source);
        delete model['_id'];
        delete model['_v'];
        delete model['__v'];

        if (extra){
            for (var a in extra){
                delete model[extra[a]];
            }
        }
        return model;
    }

    function idToObjId(id){
        var _id = null;
        try {
            _id = new mongoose.Types.ObjectId(id);
        } catch (err){
            console.log('invalid ID');
            return false;
        }

        return _id;
    }

    function setupFilters(filters){

        var result = {};

        lo.each(filters,function(el,key){

            if (!el.value){
                return;
            }
            var ret;
            //{created_on: {$gte: start, $lt: end}}
            switch (el.type){
                case 'like' : ret = new RegExp( el.value,'i');
                    break;
                case 'in' : ret = [];
                    break;
                case 'date' : ret = new Date(moment(el.value).format());
                    break;
                case 'equals' : ret = el.value;
                    break;
            }



            if (el.position){
                var newDate = {},
                    type = (el.position == 'start') ? '$gte' : '$lt';
                newDate[type] = ret;
                ret = newDate;
                if (!result[el.field]){
                    result[el.field] = {};
                }
                ret = lo.merge(result[el.field],ret);
            }

            if (el.type == 'in'){

                if (lo.isArray(el.value)){
                    ret = el.value;
                } else {
                    ret.push(el.value);
                }
            }

            if (el.field){
                key = el.field;
            }

            result[key] = (el.type == 'in') ? {$in : ret} : ret;
        });

        return result;

    }

    function itemImages(Model,images,options,callback){
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

        Model.where('_id').in(App.Helpers.MongoDB.arrayToObjIds(ids)).exec(function(err,imagesFound){
            if (err){
                return callback(err);
            }

            var ret = [];
            for (var a in imagesFound){
                ret.push(lo.merge(imagesFound[a].copies,imgObjs[imagesFound[a].id]));
            }

            return callback(null,ret);
        });
    }

    function itemThumb(Model,img,options,callback){
        if (lo.isArray(img)){
            var ids = [];
            for (var a in img){
                if (!img[a]){
                    continue;
                }
                ids.push(img[a].id);
            }
            var oIds = App.Helpers.MongoDB.arrayToObjIds(ids);

            return Model.where('_id').in(App.Helpers.MongoDB.arrayToObjIds(ids)).lean().exec(callback);
        }


        Model.findById(img.id,function(err,thumb){

            if (err){
                console.log(err);
            }
            if (!thumb){
                return callback(null,lo.merge([],img));
            }

            var ret = lo.merge(thumb.copies,img);

            return callback(null,ret);
        });
    }
});