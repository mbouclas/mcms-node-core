module.exports = (function(App){
    var mongoose = require('mongoose');
    var lo = require('lodash');
    var mongoSanitize = require('mongo-sanitize');
    var mongoose = require('mongoose');
    return {
        arrayToObjIds : arrayToObjIds,
        sanitizeModel : sanitizeModel,
        idToObjId : idToObjId,
        setupFilters : setupFilters,
        itemImages : itemImages,
        itemThumb : itemThumb,
        sanitizeForAjax : sanitizeForAjax,
        sanitizeInput : sanitizeInput,
        queryComposer : queryComposer,
        isMongooseObject : isMongooseObject
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
        if (!id){
            return id;
        }
        var _id = null;
        try {
            _id = new mongoose.Types.ObjectId(id);
        } catch (err){
            console.log('invalid ID : ' + id);
            return false;
        }

        return _id;
    }

    function setupFilters(filters){

        var result = {};

        lo.each(filters,function(el,key){

            if (!el || lo.isNull(el.value) || typeof el.value == 'undefined' || el.value == ''){
                return;
            }

            switch (el.varType){
                case 'int' : el.value = parseInt(el.value);
                    break;
                case 'float' : el.value = parseFloat(el.value);
                    break;
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
        if (!lo.isArray(images)){
            return callback(null,[]);
        }
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
        var query = {_id : {$in : App.Helpers.MongoDB.arrayToObjIds(ids)}};
        if (options.active){
            query.active = options.active
        }
        //Model.where('_id').in(App.Helpers.MongoDB.arrayToObjIds(ids)).exec(function(err,imagesFound){
        Model.find(query).exec(function(err,imagesFound){
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
                if (!img[a] || img[a] === 'undefined' || typeof img[a] == 'undefined'){
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

    function sanitizeForAjax(data,toExclude){
        if (!toExclude){
            toExclude = ['__v','_id','updated_at','created_at'];
        }

        if (lo.isArray(data)){
            processArray(data,toExclude);
        } else {
            sanitizeOne(data,toExclude);
        }

        return data;
    }

    function processArray(data,toExclude){
        for (var i in data){
            data[i] = sanitizeOne(data[i],toExclude);
        }

        return data;
    }

    function sanitizeOne(data,exclude){

        for (var key in data){
            if (exclude.indexOf(key) != -1){
                delete data[key];
            }

            if (lo.isObject(data[key])){
                sanitizeOne(data[key],exclude);
            }

            if (lo.isArray(data[key])){
                processArray(data,exclude);
            }
        }

        return data;
    }

    function sanitizeInput(input){
        if (lo.isString){
            return mongoSanitize(input);
        }

        if (lo.isObject(input) || lo.isArray(input)){
            lo.forEach(input,function(item){
                item = sanitizeInput(item);
            })
        }

        return input;
    }

    function queryComposer(query){
        var Query = [],
            queryType = {
                equals: function (key, value) {
                    var tmp = {};
                    tmp[key] = value;
                    return {
                        $match : tmp
                    }
                },
                compare : function(item){
                    var tmp = {};
                    tmp[item.field] = {};
                    tmp[item.field]['$'+item.operator] = item.value;
                    return {
                        $match : tmp
                    }
                },
                in : function(item){
                    var tmp = {};
                    tmp[item.field] = {};
                    tmp[item.field]['$in'] = item.values;
                    return {
                        $match : tmp
                    }
                },
                date : function(item){
                    //var start       = moment.utc(req.query.start).startOf('year').toDate();
                    //var end         = moment.utc(req.query.start).add('years',1).startOf('year').add('hours',1).toDate();
                    //{ $match: { date: { $gt: start, $lt: end } } }
                    var tmp = {};
                    tmp[item.field] = {};
                    if (item.start){
                        tmp[item.field]['$gt'] = item.start;
                    }
                    if (item.end){
                        tmp[item.field]['$lt'] = item.end;
                    }

                    return {
                        $match : tmp
                    }
                }
            }
            ;

        lo.forEach(query,function(item,key){
            var type;
            if (!lo.isObject(item)){//assuming equals
                Query.push(queryType.equals(key,item));
            }
            if (typeof queryType[key] !== 'undefined'){
                Query.push(queryType[key](item));
            }

        });

        return Query;
    }

    function isMongooseObject(obj){
        //check for id OR _id
        if (mongoose.Types.ObjectId.isValid(obj) || obj.constructor.name === 'ObjectID'){
            return (mongoose.Types.ObjectId.isValid(obj)) ? 'string' : 'object';
        }

        return false;
    }

});