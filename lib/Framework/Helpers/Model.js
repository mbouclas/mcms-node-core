module.exports = (function(App){
    var mongoose = require('mongoose');
    var lo = App.lodash;
    return {
        sanitizeModel : function(source,extra){
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
        },
        arrayToObjIds : function(arr){
            if (typeof arr == 'undefined' || arr.length == 0){
                return [];
            }

            var ids = [];
            var len = arr.length;
            for (var i=0; i<len; ++i) {
                if (typeof arr[i] != 'string' && typeof arr[i].length == 'undefined'){
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
        },
        idToObjId : function(id){
            var _id = null;
            try {
                _id = new mongoose.Types.ObjectId(id);
            } catch (err){
                console.log('invalid ID');
                return false;
            }

            return _id;
        },
        pagination : function(count,results_per_page,page) {
            var regFinal = results_per_page * page;
            var regInicial = regFinal - results_per_page;
            var tmp = {};
            tmp.page = page;
            tmp.total = Math.ceil(count/results_per_page);
            tmp.next = parseInt(page) + 1;
            tmp.prev = parseInt(page) - 1;
            if (regInicial == 0){
                regInicial++;
            }
            if (page == tmp.total){
                regFinal = count;
            }
            if (page > 1){
                regInicial++;
            }
            tmp.from = regInicial;
            tmp.to = regFinal;

            var totalRecordsControl = count;
            if ((totalRecordsControl%results_per_page!=0)){
                while(totalRecordsControl%results_per_page!=0){
                    totalRecordsControl++;
                }
            }

            var ultimo = String(page).substr(-1),begin=0,end=0,pageInicial=0;
            tmp.pages = new Array;
            if (ultimo == 0){
                begin = (page-9);
                pageInicial = (page - ultimo);
                end = page;
            }
            else{
                pageInicial = (page - ultimo);
                begin = (page-ultimo)+1;
                end = pageInicial+10;
            }
            var num = tmp.total;
            if (end>num){
                end = num;
            }
            for (var a = begin; a <= end ; a++){
                tmp.pages.push(a);
            }
            return tmp;
        },
        setupFilters : function(filters){

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

                result[key] = ret;
            });

            return result;

        }
    };
});