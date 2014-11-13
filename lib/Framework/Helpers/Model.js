module.exports = (function(App){
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
        }
    };
});