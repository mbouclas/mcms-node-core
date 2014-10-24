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
            //console.log(mongoose)
            var models = mongoload.bind(mongoose).load({pattern: path + '/*.js'});
            return models.mongoose.models;
        }
    };
});