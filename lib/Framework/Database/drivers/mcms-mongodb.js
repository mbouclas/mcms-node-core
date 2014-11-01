var mongoload = require('mongoload'),
    mongoose = require('mongoose');

module.exports = (function(App,Config){

    return {
        mongoose : mongoose,
        connect : function(options){
            mongoose.connect('mongodb://' + Config.host +'/' + Config.database);
            this.mongoose = mongoose;
            return mongoose.connection;
        },
        loadModels : function(mongoose,path){

            var models = mongoload.bind(mongoose).load({pattern: path + '/*.js'});
            var ret = models.mongoose.models
            mongoose.models = {};//we do this so that we can register same name models accross modules
            return ret;
        }
    };
});