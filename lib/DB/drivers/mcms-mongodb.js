var mongoload = require('mongoload'),
    mongoose = require('mongoose'),
    lo = require('lodash');

module.exports = (function(Config,App){
    var Driver =  {
        models : {},
        mongoose : mongoose,
        reConnect : function(options){
            mongoose.connect('mongodb://' + Config.user +':' + Config.password + '@' + Config.host +'/' + Config.database,
                {server: {auto_reconnect: true}});
        },
        connect : function(options){
            this.reConnect(options);
            mongoose.set('debug', Config.debug);
            this.mongoose = mongoose;
            return mongoose.connection;
        },
        loadModels : function(path){

            var models = mongoload.bind(this.mongoose).load({pattern: path + '/*.js'});
            this.models = lo.merge(this.models,models.mongoose.models);
            return models.mongoose.models;
        }
    };

    mongoose.connection.on('error', function(err){
        console.error(err);
        mongoose.connection.close();
        Driver.connect();
    });


    return Driver;
});