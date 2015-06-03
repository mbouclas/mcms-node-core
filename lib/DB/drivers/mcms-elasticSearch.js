module.exports = (function(Config,App){
    var elasticsearch = require('elasticsearch');


    var Driver =  {
        models : {},
        elasticsearch : elasticsearch,
        client : {},
        connect : function(options){
            var client = new elasticsearch.Client(Config);
            this.client = client;
            return client;
        },
        loadModels : function(path){
        }
    };

    return Driver;
});